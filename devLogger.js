const devLog = (message) => {
  /**
   * @param string: message to log
   * 
   * i.e.: devLog('This is a message that would be logged in dev-mode');
   * or  : devLog( `error at ${handler}: ${error}` );
   * 
   * returns:
   *    [method] || [browser] || [UI] @ /file/path/component/name
   *    ... message to be logged ...
   */
  
  if (process.env.DEV_LOGS == 'true') {

    // CHROME
    if (navigator.userAgent.indexOf("Chrome") != -1) {

      let base, file_path;

      // If error location is undefined don't use it as we are minified in production
      if ( (new Error).stack.split("\n")[2].split('./')[1] == undefined ) {
        file_path = false;

        // Else location is found; extract a method call & file path to prepend to log.
      } else {

        base = (new Error).stack.split("\n")[2];
        
        file_path = base
                    .split('Components')[1]
                    .split('.j')[0];
      }

      return console.log(`\n%c${file_path ? `[CHROME] @ ${file_path}:\n` : '[CHROME]:\n'}`, "color:gold", `${message}`);

    }

    // ALL OTHER BROWSERS
    else {

      let base, file_path, method;

      // If error location is undefined don't use it as we are minified in production
      if ( (new Error).stack.split("\n")[1].split('./')[1] == undefined ) {
        file_path = false;

      // Else location is found; extract a method call & file path to prepend to log.
      } else {

        // terms that are too confusing to use as a specific
        // location method that the log was called within... see method below.
        const exclusions = ['callee'];
        
        base = (new Error).stack.split("\n")[1];

        // if the method includes [...exclusions], it's in an untrackable asynchronous
        // process, so replace it with "UI", else parse through for the method name.
        method = exclusions.some(el => base.split('/')[0].includes(el)) ? 
                  "UI" : 
                  base.split('/')[0].includes('@') ? // The method is prepended to an '@', parse...
                    base.split('/')[0].split('@')[0] :
                    base.split('/')[0]; // the method is isolated and ready to be included in log

        file_path = base
                    .split('Components')[1]
                    .split('.j')[0];
      }

      // if file_path exists, preface log with file of log, else preface with Dev Log: ...
      // [UI || method || CHROME] @ filepath || devLog: 'actual message'
      return console.log(`\n%c${file_path ? `[${method}] @ ${file_path}:\n` : 'Dev Log:\n'}`, "color:gold", `${message}`);
    }
  }
  // if we're not in DEV_LOGS mode true, return nothing.
  else return;
}

export default devLog;
