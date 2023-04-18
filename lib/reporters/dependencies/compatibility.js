const { report } = require('../../../../depngn/dist/report');
const { depngn } = require('../../../../depngn');
const path = require('path');
const performAudit = async ({ projectRoot, targetNode }) => {
  try {
    const compatData = await depngn({ version: targetNode, cwd: projectRoot });
    await report(compatData, { reportOutputPath: path.resolve('lib/templates/dependencies-compatibility.html'), version: targetNode });
    } catch (err) {
      console.error('compatibility audit error: ', err);
    }
};

exports.process = performAudit;
