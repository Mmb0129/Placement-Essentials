
const fs=require('fs');


function reqHandler(req,res){
    // console.log(req.url);
    // console.log(req.method);
  //  console.log(req.headers)
    // process.exit();

    const url=req.url;

    if(url==='/'){
        res.setHeader('Content-type','text/html');
        res.write('<html>')
        res.write('<head><title>Enter Form Details</title></head>')
        res.write('<body><h1>NodeJs Is an JS Runtime</h1>')
        res.write('<form action="/message" method="POST"><input type="text" name="message"><input type="submit" value="SEND">')
       // res.write('<form enctype="multipart/form-data" action="/message" method="POST"><input type="text" name="message"><input type="file" name="FILE"><input type="submit" value="SEND">')
        
        res.write('</body>')
        res.write('</html>')
        return res.end();
    }
    const method=req.method

    if(url==='/message' && method=='POST'){

        const bodyArray=[];

        req.on('data',(chunk)=>{
            console.log('Chunk Came From Brwser:');
            console.log(chunk);
            bodyArray.push(chunk);
        })

        //These are all asynchronous code which depends on time
        //that why node js is event driven architecture
        // Since the data comes late so we dont wait for it , and execute the code that is not depends on it
        //therefore we call this as non blocking
        req.on('end',()=>{
            const parsedBody = Buffer.concat(bodyArray).toString();
            console.log(parsedBody);
            const parsed=parsedBody.split('=');

            fs.writeFileSync('UserInput.txt',parsed[1]);    //this st will wait till file is written so to avoid we can use writeFile()
        })

        fs.writeFileSync('hello.txt','Dummy text iam writing');
        
        res.setHeader('Location','/');

        res.statusCode=302;

        return res.end();


    }

    // res.setHeader('Content-type','text/html');
    // res.write('<html>')
    // res.write('<head><title>Server Response</title></head>')
    // res.write('<body><h1>NodeJs Is an JS Runtime</h1></body>')
    // res.write('</html>')
    // res.end();
}


module.exports = {
    handler:reqHandler,
    someText:'Simply I gn to remember iam exporting this fn to access in another js file'

};

//or export using exports functionality of nodejs 

// exports.handler=reqHandler;