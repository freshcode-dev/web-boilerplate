module.exports = {
  plugins: ['commitlint-plugin-jira-rules'],
  extends: ['jira'],
  rules: {
    // // UNCOMMENT ON REAL JIRA PROJECT
    // 'jira-task-id-empty': [2, 'always'],
    // 'jira-task-id-max-length': [2, 'always', 7],
    // 'jira-task-id-min-length': [2, 'always', 1],
    // 'jira-task-id-case': [2, 'always', 'uppercase'],
    // // SET TO ACTUAL PROJECT KEY
    // 'jira-task-id-project-key': [2, 'always', 'BP'],
    // 'jira-commit-message-separator': [2, 'always', ':'],
    // DISABLE ALL RULES START
    'jira-task-id-empty': [0],
    'jira-task-id-max-length': [0],
    'jira-task-id-min-length': [0],
    'jira-task-id-case': [0],
    'jira-task-id-project-key': [0],
    'jira-commit-message-separator': [0],
    // DISABLE ALL RULES END
    'header-max-length': [2, 'always', 100]
  }
};
