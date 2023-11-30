App = {
  webProvider: null,
  contracts: {},
  account: "0x0",
  adminAcess: false,

  init: function () {
    return App.initWeb();
  },

  initWeb: function () {
    // if an ethereum provider instance is already provided by metamask
    const provider = window.ethereum;
    if (provider) {
      // currently window.web3.currentProvider is deprecated for known security issues.
      // Therefore it is recommended to use window.ethereum instance instead
      App.webProvider = provider;
    } else {
      //  $("#loader-msg").html('No metamask ethereum provider found')
      console.log("No Ethereum provider");
      // specify default instance if no web3 instance provided
      App.webProvider = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545")
      );
    }

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("missingDiary.json", function (missingDiary) {
      // instantiate a new truffle contract from the artifict
      App.contracts.MissingDiary = TruffleContract(missingDiary);

      // connect provider to interact with contract
      App.contracts.MissingDiary.setProvider(App.webProvider);

      //  App.listenForEvents();

      return App.render();
    });
  },

  render: async function () {
    let missingDiaryInstance;
    const loader = $("#loader");
    const content = $("#content");

    loader.show();
    content.hide();

    // load account data
    if (window.ethereum) {
      try {
        // recommended approach to requesting user to connect mmetamask instead of directly getting the accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        App.account = accounts;
        $("#accountAddress").html("Your Account: " + App.account);
      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
          console.warn("user rejected");
        }
        $("#accountAddress").html("Your Account: Not Connected");
        console.error(error);
      }
    }

    //load contract data
    App.contracts.MissingDiary.deployed()
      .then(function (instance) {
        missingDiaryInstance = instance;
        return missingDiaryInstance.missingPersonListCounter();
      })
      .then(function (listCounter) {
        var missingPersonsListResults = $("#missingPersonsListResults");
        missingPersonsListResults.empty();

        if (listCounter == 0){
          loader.html('There is no data available!');
          return;
        }

        const divisonMapping = {
          0: "Barishal",
          1: "Chittagong",
          2: "Dhaka",
          3: "Khulna",
          4: "Rajshahi",
          5: "Rangpur",
          6: "Mymensingh",
          7: "Sylhet",
        };

        const statusMapping = {
          0: "Missing",
          1: "Found",
        };

        foundPeopleNumber = 0;
        for (let i = 1; i <= listCounter; i++) {
          missingDiaryInstance.missingPersons(i).then(function (person) {
            var status = statusMapping[person[3]];

            // if (status === "Found") {
            //   foundPeopleNumber++;
            //   return 0;
            // }
            var name = person[0];
            var age = person[1];
            var height = person[2];
            
            var description = person[4];
            var divison = divisonMapping[person[5]];
            var contactNumber = person[6];
            var personTemplate =
              "<tr><th>" +
              i +
              "</th><td>" +
              name +
              "</td><td>" +
              age +
              "</td><td>" +
              height +
              "</td><td>" +
              description +
              "</td><td>" +
              divison +
              "</td><td>" +
              contactNumber +
              "</td><td class=admin-column>" +
              "<button onclick=\"App.toggleStatus('" + i + "')\">"+status+"</button>" +
              "</td></tr>";
            missingPersonsListResults.append(personTemplate);
          });
        };
        loader.hide();
        content.show();
  
      })
      
      // wait 300 ms for the render to complete and then call the admin function
      setTimeout(() => {
        App.isAdmin();
      }, 400)
      
  },

  isAdmin: function(){
    App.contracts.MissingDiary.deployed()
    .then(function (instance) {
        return instance.isAdmin({ from: App.account[0] });
      })
    .then(function (isAdmin) {
      console.log(isAdmin);
      App.adminAcess = isAdmin;
      console.log(App.adminAcess);

      if (App.adminAcess == true){
        const adminColumn = document.querySelectorAll(".admin-column");
        console.log('number of rows',adminColumn.length);
        adminColumn.forEach((column) => {
          column.style.display = "table-cell";
        });
      }
    })
  },

  toggleForm: function () {
    var form = $("#missingForm");
    var openFormButton = $("#openFormButton");
    if (form.is(":hidden")) {
      form.show();
      openFormButton.hide();
    } else {
      form.hide();
      openFormButton.show();
    }
  },

  toggleStatus: function (id) {
    App.contracts.MissingDiary.deployed()
    .then(function (instance) {
        return instance.toggleStatus(+id, { from: App.account[0] });
      })
    .then(function(result){
      console.log(result);
      alert("Status has been changed successfully");
    })
    .catch(function(error){
      console.error(error);
    })
  },

  // add a missing person
  addMissingPerson: function () {
    let name = $("#name").val();
    let age = parseInt($("#age").val());
    let height = parseInt($("#height").val());
    let description = $("#description").val();
    let division = parseInt($("#division").val());
    let contactNumber = $("#contactNumber").val();

    console.log(name, age, height, description, division, contactNumber);

    App.contracts.MissingDiary.deployed()
      .then(function (instance) {
        return instance.addMissingPerson(
          name,
          age,
          height,
          description,
          division,
          contactNumber,
          { from: App.account[0] }
        );
      })
      .then(function (result) {
        console.log(result);
        alert("Missing Person details have been added successfully");
      })
      .catch(function (err) {
        console.log(err);
      });
  },

  // voted event
  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      instance
        .votedEvent(
          {},
          {
            fromBlock: 0,
            toBlock: "latests",
          }
        )
        .watch(function (err, event) {
          console.log("Triggered", event);
          // reload page
          App.render();
        });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
