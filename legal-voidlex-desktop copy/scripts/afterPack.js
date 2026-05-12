const { execSync } = require('child_process');
const path = require('path');

exports.default = async function (context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);

  console.log(`\n=========================================================`);
  console.log(`[afterPack Hook] Custom Ad-Hoc Deep Signing: ${appPath}`);
  console.log(`=========================================================`);
  
  try {
    // Run deep ad-hoc codesign command directly on the unpacked .app bundle
    execSync(`codesign --force --deep --sign - "${appPath}"`, { stdio: 'inherit' });
    console.log('[afterPack Hook] Ad-Hoc Deep Signing completed successfully!\n');
  } catch (error) {
    console.error('[afterPack Hook] Error during ad-hoc signing:', error);
    // Do not fail the build, let it proceed
  }
};
