export const config = {
  get organizationName() {
    return process.env.ORGANIZATION_NAME;
  },
  get projectName() {
    return process.env.PROJECT_NAME;
  },
  get personalAccessToken() {
    const token = process.env.AZURE_PERSONAL_ACCESS_TOKEN;

    if (!token) {
      console.error("AZURE_PERSONAL_ACCESS_TOKEN was undefined.");
      process.exit(1);
    }
    return token;
  },
};
