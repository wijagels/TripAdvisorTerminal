var ta = require('./ta');

var takey = process.env.TRIPADVISOR_KEY;
if(takey) {
    ta.mainloop();
}
else {
    console.log("No key provided, please export TRIPADVISOR_KEY");
    process.exit(1);
}

process.on('exit', function(code) {
    console.log("Exiting! Code: " + code);
});
