function initCardKanban(root) {
  var X = { todo: 10, done: 124 };
  var TOP = 36;
  var ROW = 40;
  var NAME = { todo: 'To do', done: 'Done' };
  var TICK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';
  var colEls = root.querySelectorAll('.card-kanban__col');
  var counts = root.querySelectorAll('.card-kanban__head span');
  var live = root.querySelector('.card-kanban__live');
  var slot = document.createElement('span');
  slot.className = 'card-kanban__slot';
  slot.setAttribute('aria-hidden', 'true');
  var chips = {};
  var cols = { todo: [], done: [] };
  root.querySelectorAll('.card-kanban__chip').forEach(function (chip) {
    var id = chip.textContent.trim();
    chips[id] = chip;
    cols[chip.classList.contains('card-kanban__chip--done') ? 'done' : 'todo'].push(id);
  });
  var drag = null;
  var moved = false;

  function without(list, id) {
    return list.filter(function (t) {
      return t !== id;
    });
  }
  // Where every chip sits: the held one is taken out and slotted in where it would land.
  function layout(c, d) {
    var out = { todo: without(c.todo, d && d.id), done: without(c.done, d && d.id) };
    if (d) out[d.col].splice(d.at, 0, d.id);
    return out;
  }
  function columnOf(id) {
    return cols.todo.indexOf(id) > -1 ? 'todo' : 'done';
  }
  function dress(chip, id, c) {
    var done = c === 'done';
    if (chip.classList.contains('card-kanban__chip--done') !== done) {
      chip.classList.toggle('card-kanban__chip--done', done);
      chip.innerHTML = (done ? TICK : '') + id;
    }
    chip.setAttribute('aria-label', id + ', in ' + NAME[c] + '. Press to move it to ' + (done ? 'To do' : 'Done') + '.');
  }
  function render() {
    var view = layout(cols, drag);
    ['todo', 'done'].forEach(function (c, k) {
      colEls[k].classList.toggle('card-kanban__col--target', !!drag && drag.col === c);
      counts[k].textContent = view[c].length;
      view[c].forEach(function (id, i) {
        var chip = chips[id];
        var held = !!drag && drag.id === id;
        chip.classList.toggle('card-kanban__chip--held', held);
        // The held chip follows the pointer, tilted; the rest glide to their slots.
        chip.style.transform = held
          ? 'translate(' + (drag.x - drag.dx) + 'px, ' + (drag.y - drag.dy) + 'px) rotate(4deg) scale(1.05)'
          : 'translate(' + X[c] + 'px, ' + (TOP + i * ROW) + 'px)';
        dress(chip, id, c);
      });
    });
    if (drag) {
      slot.style.left = X[drag.col] + 'px';
      slot.style.top = TOP + drag.at * ROW + 'px';
      if (!slot.parentNode) root.insertBefore(slot, chips[cols.todo[0] || cols.done[0]]);
    } else if (slot.parentNode) {
      slot.remove();
    }
  }
  // Keep the document order the same as the board, so Tab walks it column by column.
  function reorder() {
    var focused = document.activeElement;
    cols.todo.concat(cols.done).forEach(function (id) {
      root.insertBefore(chips[id], live);
    });
    if (focused && focused !== document.activeElement && root.contains(focused)) focused.focus({ preventScroll: true });
  }
  function local(e) {
    var r = root.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function target(x, y, id) {
    var col = x < 120 ? 'todo' : 'done';
    var n = without(cols[col], id).length;
    return { col: col, at: Math.max(0, Math.min(n, Math.round((y - TOP - 17) / ROW))) };
  }
  function say(id, col) {
    live.textContent = 'Moved ' + id + ' to ' + NAME[col];
  }

  function onDown(e) {
    if (e.button) return;
    var chip = e.currentTarget;
    var id = chip.textContent.trim();
    var c = columnOf(id);
    var i = cols[c].indexOf(id);
    var p = local(e);
    chip.setPointerCapture(e.pointerId);
    moved = false;
    drag = { id: id, x: p.x, y: p.y, dx: p.x - X[c], dy: p.y - (TOP + i * ROW), x0: p.x, y0: p.y, col: c, at: i };
    render();
  }
  function onMove(e) {
    if (!drag || drag.id !== e.currentTarget.textContent.trim()) return;
    var p = local(e);
    if (Math.hypot(p.x - drag.x0, p.y - drag.y0) > 4) moved = true;
    var t = target(p.x, p.y, drag.id);
    drag.x = p.x;
    drag.y = p.y;
    drag.col = t.col;
    drag.at = t.at;
    render();
  }
  function onUp() {
    if (!drag) return;
    var d = drag;
    drag = null;
    if (moved) {
      var from = columnOf(d.id);
      cols = layout(cols, d);
      if (d.col !== from) say(d.id, d.col);
      reorder();
    }
    render();
  }
  function onCancel() {
    drag = null;
    render();
  }
  // A click (or Enter) without a drag sends the chip to the other column.
  function onClick(e) {
    if (moved) {
      moved = false;
      return;
    }
    var id = e.currentTarget.textContent.trim();
    var col = columnOf(id) === 'todo' ? 'done' : 'todo';
    cols = layout(cols, { id: id, col: col, at: without(cols[col], id).length });
    say(id, col);
    reorder();
    render();
  }
  var list = Object.keys(chips).map(function (id) {
    return chips[id];
  });
  list.forEach(function (chip) {
    chip.addEventListener('pointerdown', onDown);
    chip.addEventListener('pointermove', onMove);
    chip.addEventListener('pointerup', onUp);
    chip.addEventListener('pointercancel', onCancel);
    chip.addEventListener('click', onClick);
  });
  return function () {
    list.forEach(function (chip) {
      chip.removeEventListener('pointerdown', onDown);
      chip.removeEventListener('pointermove', onMove);
      chip.removeEventListener('pointerup', onUp);
      chip.removeEventListener('pointercancel', onCancel);
      chip.removeEventListener('click', onClick);
    });
  };
}

document.querySelectorAll('.card-kanban').forEach(initCardKanban);
