const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
  ignores: [(message) => /Signed-off-by: dependabot\[bot\]/m.test(message)],
};

export default commitlintConfig;
