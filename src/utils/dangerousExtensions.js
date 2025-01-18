export const dangerousExtensions = [
  // Executable and System Files
  "exe", "bat", "cmd", "com", "msi", "apk", "sh", "bash", "bin", "jar", "ps1", "wsf", "vbs", 
  "vb", "scr", "reg", "dll", "pl", "py", "js", "cgi", "rb", "wsf", "app", "r", "asp", "aspx", 
  "php", "php3", "php4", "php5", "phps", "phtml", "jsp", "cfm", "pl", "py", "js", "vbs", "pl", 
  "cshtml", "ajax", "json", "bat", "sh", "bash", "zsh", "csh", "ps1", "vbe", "jscript", "exe", 
  "msi", "py", "pl", "jar", "cgi", "html", "php5", "html5", "htm", "html", "shtml", "xhtml",
  "svg", "css", "scss", "ts", "jsm", "xaml", "vbscript", "es", "ts", "scss", "phtm", "dll", 
  "dat", "dat", "bat", "sh", "wsf", "vbs", "js",

  // Web-related dangerous files
  "html", "htm", "xhtml", "xsl", "xml", "json", "tpl", "cfm", "erb", "asp", "aspx", "php5", 
  "php3", "php4", "phps", "phtml", "jsp", "cfm", "pl", "cgi", "shtml", "shtm", "css", 
  "tpl", "cfc", "json", "htaccess", "htpasswd", "inc", "svn", "git", "bak", "db", "sql", "sh", 
  "bash", "php3", "php4", "jsp", "asp", "aspx", "html", "js", "js", "json", "php", "html", "htm", 
  "json", "yaml", "yaml", "text", "txt", "log", "conf", "json", "ts", "yml", "xml", "ini", "csv", 
  "javascript", "ejs", "vue", "jsx", "html5",

  // Documents and formats with macro risks or scripting capabilities
  "docm", "xlsm", "pptm", "docx", "xlsx", "pptx", "xls", "doc", "ppt", "rtf", "odt", "ods", 
  "odp", "potx", "potm", "dotx", "dotm", "pub", "pages", "key", "numbers", "wpd", "odm", "odc", 
  "odf", "psd", "ai", "eps", /*"pdf",*/ "ppt", "key", "csv", "tex", "md", "rst", "log", "swf", "fla", 
  "xlsb", "docb", "xps", "pages", "pages", "key", "pot", "keynote", "oxps", "msg", "mht", "mhtml", 
  "epub", "oxps", "chm", "epub", "md", "epub", "mobi", "txt", "rtf", "swf", "ejs", "json", "doc", 
  "html", "html5", "htm", "html", "odt", "pages", "pub", "key", "epub",

  // Files used for exploits or attacks
  "dat", "bak", "temp", "swp", "vmdk", "dmp", "dump", "log", "reg", "env", "tmp", "json", "bin", 
  "dat", "b64", "hex", "base64", "encrypted", "crypto", "enc", "ps", "sha1", "sha256", "zip", 
  "gz", "7z", "rar", "tar", "tar.gz", "tar.bz2", "xz", "iso", "dmg", "iso", "tar.bz2", "tgz", "tar", 
  "lzh", "cab", "7z", "chm", "apk", "ipa", "hqx", "uefi", "gz", "zst", "xz", "tbz", "lz", "vhd", 
  "iso", "rpm", "deb", "pkg", "dmg", "crx", "xpi", "jar", "apk", "exe", "vbe", "java", "b64", "obj", 
  "rpm", "img", "swf", "avi", "mkv", "mpg", "mpeg",

  // Malicious file types and scripting languages
  "jar", "vbs", "php", "sh", "jsp", "htaccess", "asp", "html", "cgi", "js", "css", "json", 
  "vbe", "bat", "cmd", "exe", "apk", "sh", "bash", "js", "html", "htm", "asp", "jsp", "htm", "php", 
  "dat", "dat", "bat", "exe", "app", "jar", "exe", "js", "dll", "sys", "bat", "debug", "com", "msi",
  "vmdk", "oob", "msp", "js", "swf", "asp", "html5", "pkg", "json", "msp", "js", "dmg", "apk", "bin",'locky','crypt',
'cryptolocker', 'cerber','tesla','conti','wannacry','files','ransom','gzip','mp3','mp4','hta',

  // System-level files
  "sys", "msi", "exe", "vbs", "dll", "drv", "bin", "dat", "dat", "sh", "bash", "bat", "reg", "config", 
  "log", "bak", "swp", "temp", "swf", "cpl", "swt", "shtml", "jar", "dmp", "img", "vmdk", "iso", 
  "mnt", "sys", "ini", "cab", "dmg", "log", "dbg", "bat", "cer", "crl", "pem", "csr", "key", "pfx", 
  "p12", "crt", "cer", "csm", "shtml", "php", "htaccess", "pdb", "avx", "vmx", "vmx", "dat", "sys", 
  "pvm", "ovf", "vhd", "ova", "bin", "htaccess", "dat", "debug", "msi", "bat", "cmd", "vbe", "pl",
  "jscript", "dll", "py", "rb", "cgi", "scpt", "nsf", "scr", "clj", "nsh", "command", "csh", "zsh", 
  "ksh", "tcsh", "fish", "cmd", "bash", "sh", "pl", "perl", "lua", "io", "pogo", "tk", "rst", "ejs", 
  "json", "html5", "html", "htm", "js", "html", "cpp", "h", "pyc", "class", "exe", "pl", "pm", "cgi", 
  "osx", "dylib", "axd", "axd", "dat", "dmp", "pid", "bin", "swp", "swf", "scr", "bz2", "tar", "rar", 
  "csv", "sql", "bak", "ico", "pfx", "s7z", "csv", "rst", "gpx", "asc", "keygen", "shs", "dat", "js", 
  "html", "scss", "xml", "css", "md", "dll", "html5", "dat", "log", "txt", "xml", "odt", "exe", "pfx", 
  "apk", "tar", "json", "css", "xml", "eps", "html5", "py", "sh", "js"
];

//520