// Difficulty Sorting Logic for Bible Game Night
(function() {
  const diffOrder = { 'easy': 0, 'medium': 1, 'hard': 2 };
  
  function assignDifficulty(q) {
    if (q.d) {
      q.d = q.d.toLowerCase();
      if (diffOrder[q.d] === undefined) q.d = 'medium';
      return;
    }
    const txt = (q.q || q.b || '').toLowerCase();
    // Simple heuristic: long questions or specific complex names are hard
    if (txt.length > 120 || /melchizedek|nehemiah|habakkuk|zephaniah|propitiation|sanctification|eschatology|ecclesiastes/.test(txt)) {
      q.d = 'hard';
    } else if (txt.length > 70 || /chronicles|deuteronomy|thessalonians|philippians/.test(txt)) {
      q.d = 'medium';
    } else {
      q.d = 'easy';
    }
  }

  // Process Main Question Bank
  if (typeof QB !== 'undefined') {
    for (let cat in QB) {
      QB[cat].forEach(assignDifficulty);
      QB[cat].sort((a, b) => diffOrder[a.d] - diffOrder[b.d]);
    }
    console.log("[BGN] Main Question Bank sorted by difficulty.");
  }

  // Process True/False Questions
  if (typeof TF_Q !== 'undefined') {
    TF_Q.forEach(assignDifficulty);
    TF_Q.sort((a, b) => diffOrder[a.d] - diffOrder[b.d]);
    console.log("[BGN] True/False Question Bank sorted by difficulty.");
  }

  // Process Verse Questions
  if (typeof VERSE_Q !== 'undefined') {
    VERSE_Q.forEach(assignDifficulty);
    VERSE_Q.sort((a, b) => diffOrder[a.d] - diffOrder[b.d]);
    console.log("[BGN] Verse Question Bank sorted by difficulty.");
  }
})();
