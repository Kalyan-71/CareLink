function parseLabReport(rawText) {
  const lines = rawText.split("\n");
  const testPattern = /^(.*?)(\d+(\.\d+)?)(\s*[a-zA-Z%/]+)$/; // matches test name + number + unit
  const tests = [];

  for (const line of lines) {
    const match = line.match(testPattern);
    if (match) {
      const name = match[1].trim();
      const value = match[2];
      const unit = match[4].trim();
      tests.push({
        name,
        result: value,
        unit,
      });
    }
  }

  return [
    {
      department: "AUTO-PARSED",
      tests,
    },
  ];
}

module.exports = { parseLabReport };
