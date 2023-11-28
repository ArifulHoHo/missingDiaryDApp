// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract missingDiary{
    
    // stores the address of the admin
    address private immutable admin;

    // An enumeration representing the status of a missing person, either "Missing" or "Found."
    enum Status { Missing, Found }

    // An enumeration representing 8 possible values of divisons
    enum Divison { Barishal, Chittagong, Dhaka, Khulna, Rajshahi, Rangpur, Mymensingh, Sylhet }

    // model the missing person form
    struct MissingPerson{
        string name;
        uint age;
        uint height;
        Status status;
        string description;
        Divison division;
        string contactNumber;
        bytes32 personIdHash;
    }

    // stores list of missing people
    mapping (uint => MissingPerson) public missingPersons;

    mapping(bytes32 => uint) public personIdByHash; // Mapping to store personId as key with value of the index

    // keeps count of missing people from each division
    mapping(Divison => uint) public missingCountByDivision;

    uint private lastPersonId; // Counter for assigning incremental personId

    uint public missingPersonListCounter; // tracks the size of the mapping

    // This event is emitted when a new missing person is added to the system
    event MissingPersonAdded(address indexed user, bytes32 indexed personId, string name, Divison division);

    //  This event is emitted when the status of a missing person is updated
    event StatusUpdated(address indexed admin, uint indexed personId, Status status);

    // A modifier to restrict certain functions to admin users
    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not an admin");
        _;  // this is called a placeholder
    }

    // Sets the deploying address as the admin
    constructor() {
        admin = msg.sender;
    }

    // function to add the missing person in the list
    function addMissingPerson (
        string memory _name, 
        uint _age,
        uint _height,
        string memory _description,
        Divison _division,
        string memory _contactNumber
    ) external {
        // hash to get unique id for each missing person
        bytes32 _personIdHash = keccak256(abi.encodePacked(_name, _division, _age, _height, _contactNumber));

        // Increment lastPersonId and missingPersonListCOunter
        lastPersonId++;
        missingPersonListCounter = lastPersonId;

        // Ensure personIdHash is unique
        require(personIdByHash[_personIdHash] == 0, "Person already added");
        
        missingPersons[lastPersonId] = MissingPerson({
            name: _name,
            age: _age,
            height: _height,
            status: Status.Missing,
            description: _description,
            division: _division,
            contactNumber: _contactNumber,
            personIdHash : _personIdHash
        });
        
        missingCountByDivision[_division]++; // increment missing person in the division
        personIdByHash[_personIdHash] = lastPersonId;
        // emit the event of missing person being added
        emit MissingPersonAdded(msg.sender, _personIdHash, _name, _division);
    }

    // function to toggle missing to found ONLY by Admin
    function toggleStatus ( uint _personId ) external onlyAdmin {
        require(missingPersons[_personId].age != 0, "No account exists in the missing list database");
        require(missingPersons[_personId].status != Status.Found, "Person is already found!");

        // toggle status
        missingPersons[_personId].status = Status.Found;
        // decrement missing count number of the specific division
        missingCountByDivision[missingPersons[_personId].division]--;

        // emit when status is updated
        emit StatusUpdated(admin, _personId, Status.Found);
    }
}


