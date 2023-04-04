pragma solidity ^0.8.7;
contract CampainFactory{
    address[] public deployedCampains;
    function createCampain(uint minimum) public{
        address newCampain =address(new Campain(minimum,msg.sender));
        deployedCampains.push(newCampain);
    }

    function getDeployedCampains() public view returns(address[] memory){
        return deployedCampains;
    }
}
contract Campain{
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }


    address public manager;
    uint public minimumContribution;
    uint public approversCount;
    mapping(address => bool) public approvers;
         
    uint numRequests;
    mapping (uint => Request) requests;


    modifier restricted(){
        require(msg.sender==manager,"you are not the manager!");
        _;
    }

    constructor(uint minimum,address creator){
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable{
        require(msg.value> minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string memory description,uint value,address recipient) public restricted{
        ///ghablan in bood ke error mide jadidan
    //      Request memory newRequest = Request({
    //       description: description,
    //       value: value,
    //       recipient: recipient,
    //       complete: false,
    //       approvalCount: 0
    //   });
    //   requests.push(newRequest);

        require(approvers[msg.sender]);
            Request storage r = requests[numRequests++];
                r.description = description;
                r.value = value;
                r.recipient = recipient;
                r.complete = false;
                r.approvalCount = 0;
    }

    function approveRequest(uint index) public{
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(index<numRequests);
        require(!request.approvals[msg.sender]);
        request.approvalCount++;
        request.approvals[msg.sender]=true;
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount  > approversCount/2);
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}pragma solidity ^0.8.7;

