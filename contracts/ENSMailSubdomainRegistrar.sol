// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IENS {
    function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external returns (bytes32);
    function setResolver(bytes32 node, address resolver) external;
    function owner(bytes32 node) external view returns (address);
}

interface IResolver {
    function setAddr(bytes32 node, address addr) external;
    function setText(bytes32 node, string calldata key, string calldata value) external;
}

/**
 * @title ENSMail Subdomain Registrar
 * @dev Allows users to register subdomains under mail.eth for decentralized messaging
 */
contract ENSMailSubdomainRegistrar is Ownable, ReentrancyGuard {
    IENS public immutable ens;
    IResolver public immutable resolver;
    
    // The parent domain node (mail.eth)
    bytes32 public immutable parentNode;
    
    // Mapping of subdomain labels to their owners
    mapping(bytes32 => address) public subdomainOwners;
    
    // Mapping to track registered subdomains
    mapping(bytes32 => bool) public isSubdomainRegistered;
    
    // Events
    event SubdomainRegistered(
        bytes32 indexed label,
        string subdomain,
        address indexed owner,
        bytes32 indexed node
    );
    
    event ProfileUpdated(
        bytes32 indexed node,
        address indexed owner,
        string key,
        string value
    );
    
    constructor(
        address _ens,
        address _resolver,
        bytes32 _parentNode
    ) {
        ens = IENS(_ens);
        resolver = IResolver(_resolver);
        parentNode = _parentNode;
    }
    
    /**
     * @dev Register a subdomain under mail.eth
     * @param label The subdomain label (e.g., "alice" for alice.mail.eth)
     * @param owner The address that will own the subdomain
     */
    function registerSubdomain(
        string calldata label,
        address owner
    ) external nonReentrant {
        require(bytes(label).length >= 3, "Label too short");
        require(bytes(label).length <= 20, "Label too long");
        require(owner != address(0), "Invalid owner address");
        
        bytes32 labelHash = keccak256(bytes(label));
        require(!isSubdomainRegistered[labelHash], "Subdomain already registered");
        
        // Create the subdomain node
        bytes32 subdomainNode = ens.setSubnodeOwner(parentNode, labelHash, address(this));
        
        // Set the resolver for the subdomain
        ens.setResolver(subdomainNode, address(resolver));
        
        // Set the address record to point to the owner
        resolver.setAddr(subdomainNode, owner);
        
        // Set initial text records
        resolver.setText(subdomainNode, "inboxPointer", addressToString(owner));
        resolver.setText(subdomainNode, "displayName", label);
        
        // Transfer ownership to the user
        ens.setSubnodeOwner(parentNode, labelHash, owner);
        
        // Update mappings
        subdomainOwners[labelHash] = owner;
        isSubdomainRegistered[labelHash] = true;
        
        emit SubdomainRegistered(labelHash, label, owner, subdomainNode);
    }
    
    /**
     * @dev Check if a subdomain is available
     * @param label The subdomain label to check
     * @return available True if the subdomain is available
     */
    function isSubdomainAvailable(string calldata label) external view returns (bool available) {
        bytes32 labelHash = keccak256(bytes(label));
        return !isSubdomainRegistered[labelHash];
    }
    
    /**
     * @dev Get the owner of a subdomain
     * @param label The subdomain label
     * @return owner The address that owns the subdomain
     */
    function getSubdomainOwner(string calldata label) external view returns (address owner) {
        bytes32 labelHash = keccak256(bytes(label));
        return subdomainOwners[labelHash];
    }
    
    /**
     * @dev Update profile information for a subdomain (only owner can call)
     * @param label The subdomain label
     * @param key The text record key
     * @param value The text record value
     */
    function updateProfile(
        string calldata label,
        string calldata key,
        string calldata value
    ) external {
        bytes32 labelHash = keccak256(bytes(label));
        require(subdomainOwners[labelHash] == msg.sender, "Not subdomain owner");
        
        bytes32 subdomainNode = keccak256(abi.encodePacked(parentNode, labelHash));
        resolver.setText(subdomainNode, key, value);
        
        emit ProfileUpdated(subdomainNode, msg.sender, key, value);
    }
    
    /**
     * @dev Convert address to string
     * @param addr The address to convert
     * @return The string representation of the address
     */
    function addressToString(address addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
    
    /**
     * @dev Emergency function to update resolver (only owner)
     * @param newResolver The new resolver address
     */
    function updateResolver(address newResolver) external onlyOwner {
        // Implementation would update the resolver for future subdomains
        // This is a safety mechanism for contract upgrades
    }
}
