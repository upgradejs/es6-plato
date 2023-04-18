const {execAsync, getLockFilesExistence} = require('../../util');

async function generateYarnAuditReport(projectRootPath) {
  const originalCwd = process.cwd();
  try {
    await execAsync(`yarn outdated --cwd "${projectRootPath}" --json | ${originalCwd}/node_modules/.bin/yarn-outdated-html --output ${originalCwd}/lib/templates/dependencies-outdated.html`);
  }catch (err) {
    console.log('generateYarnAuditReport error: ', err);
  }
}

async function generateNpmAuditReport(projectRootPath) {
  const originalCwd = process.cwd();
  process.chdir(projectRootPath);
  try {
    await execAsync(`npm outdated --json --long | ${originalCwd}/node_modules/.bin/npm-outdated-html --output ${originalCwd}/lib/templates/dependencies-outdated.html`);
  }
  catch (err) {
    console.log('generateNpmAuditReport error: ', err);
  }
  finally {
    process.chdir(originalCwd);
  }
}

const performAudit = async ({ projectRoot }) => {
  const { packageLockExist, yarnLockExist } = await getLockFilesExistence(projectRoot);

  if (yarnLockExist) {
    await generateYarnAuditReport(projectRoot);
  } else if (packageLockExist) {
    await generateNpmAuditReport(projectRoot);
  } else {
    // pnpm support goes here
  }
};

exports.process = performAudit;
