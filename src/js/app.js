App = {
 webProvider: null,
 contracts: {},
 account: '0x0',


 init: function() {
   return App.initWeb();
 },


 initWeb:function() {
   // if an ethereum provider instance is already provided by metamask
   const provider = window.ethereum
   if( provider ){
     // currently window.web3.currentProvider is deprecated for known security issues.
     // Therefore it is recommended to use window.ethereum instance instead
     App.webProvider = provider;
   }
   else{
     $("#loader-msg").html('No metamask ethereum provider found')
     console.log('No Ethereum provider')
     // specify default instance if no web3 instance provided
     App.webProvider = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
   }

   return App.render();
 },
 


 initContract: function() {
     $.getJSON("Election.json", function( election ){
     // instantiate a new truffle contract from the artifict
     App.contracts.Election = TruffleContract( election );


     // connect provider to interact with contract
     App.contracts.Election.setProvider( App.webProvider );
     
     App.listenForEvents();


     return App.render();
   })
 },


 render: async function(){
   let electionInstance;
   const loader = $("#loader");
   const content = $("#content");


   loader.show();
   content.hide();
  
   // load account data
   if (window.ethereum) {
     try {
       // recommended approach to requesting user to connect mmetamask instead of directly getting the accounts
       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
       App.account = accounts;
       $("#accountAddress").html("Your Account: " + App.account);
     } catch (error) {
       if (error.code === 4001) {
         // User rejected request
         console.warn('user rejected')
       }
       $("#accountAddress").html("Your Account: Not Connected");
       console.error(error);
     }
   }


   //load contract ddata
   App.contracts.Election.deployed()
   .then( function( instance ){
     electionInstance = instance;


     return electionInstance.candidatesCount();
   }) 
   .then( function( candidatesCount ){
     var candidatesResults = $("#candidatesResults");
     candidatesResults.empty();


     var candidatesSelect = $("#candidatesSelect");
     candidatesSelect.empty();


     for (let i = 1; i <= candidatesCount; i++) {
       electionInstance.candidates( i )
       .then( function( candidate ){
         var id = candidate[0];
         var name = candidate[1];
         var voteCount = candidate[2];
        
         // render results
         var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
         candidatesResults.append( candidateTemplate );


         //render balloot option
         let candidateOption = "<option value=" + id +  ">" + name + "</option>"
         candidatesSelect.append( candidateOption )
       });
     }
     return electionInstance.voters(  App.account )
   })
   .then( function( hasVoted ){
     // don't allow user to vote
     if(hasVoted){
       $( "form" ).hide()
     }
     loader.hide();
     content.show();
   })
   .catch( function( error ){
     console.warn( error )
   });
 },


 // casting vote
 castVote: function(){
   let candidateId = $("#candidatesSelect").val();
   App.contracts.Election.deployed()
   .then( function( instance ){
     return instance.vote( candidateId, { from: App.account[0] } )
   })
   .then( function( result ){
     // wait for voters to update vote
     console.log({ result })
       // content.hide();
       // loader.show();
       alert("You have voted successfully")
   })
   .catch( function( err ){
     console.error( err )
   } )
 },
 
 // voted event
 listenForEvents: function(){
   App.contracts.Election.deployed()
   .then( function( instance ){
     instance.votedEvent({}, {
       fromBlock: 0,
       toBlock: "latests"
     })
     .watch( function( err, event ){
       console.log("Triggered", event);
       // reload page
       App.render()
     })
   })
 }


};


$(function() {
 $(window).load(function() {
   App.init();
 });
});


