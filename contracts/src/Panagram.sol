// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IVerifier} from "./Verifier.sol";

contract Panagram is ERC1155, Ownable {
    IVerifier private s_verifier;
    bytes32 private s_answer;
    uint256 public constant MIN_DURATION = 10800;
    uint256 private s_roundStartTime;
    address private s_currentRoundWinner;
    uint256 private s_currentRound;
    mapping(address user => uint256 round) private s_lastCorrectGuessRound;

    event Panagram__VerifierUpdated(IVerifier verifier);
    event Panagram__NewRoundStarted(bytes32 answer);
    event Panagram__WinnerCrowned(address indexed winner, uint256 round);
    event Panagram__RunnerUpCrowned(address indexed runnerUp, uint256 round);

    error Panagram__RoundMinDurationNotPassed(
        uint256 minDuration,
        uint256 timePassed
    );
    error Panagram__NoRoundWinner();
    error Panagram__FirstPanagramNotStarted();
    error Panagram__AlreadyGuessedCorrectly(uint256 round, address user);
    error Panagram__InvalidProof();

    constructor(
        IVerifier verifier
    )
        ERC1155(
            "ipfs://bafybeicqfc4ipkle34tgqv3gh7gccwhmr22qdg7p6k6oxon255mnwb6csi/{id}.json"
        )
        Ownable(msg.sender)
    {
        s_verifier = verifier;
    }

    function newRound(bytes32 answer) external onlyOwner {
        if (s_roundStartTime == 0) {
            s_roundStartTime = block.timestamp;
            s_answer = answer;
        } else {
            if (s_roundStartTime + MIN_DURATION > block.timestamp) {
                revert Panagram__RoundMinDurationNotPassed(
                    MIN_DURATION,
                    block.timestamp - s_roundStartTime
                );
            }

            if (s_currentRoundWinner == address(0)) {
                revert Panagram__NoRoundWinner();
            }

            s_roundStartTime = block.timestamp;
            s_currentRoundWinner = address(0);
            s_answer = answer;
        }

        s_currentRound++;
        emit Panagram__NewRoundStarted(answer);
    }

    function makeGuess(bytes memory proof) external returns (bool) {
        if (s_currentRound == 0 || s_roundStartTime == 0) {
            revert Panagram__FirstPanagramNotStarted();
        }

        if (s_lastCorrectGuessRound[msg.sender] == s_currentRound) {
            revert Panagram__AlreadyGuessedCorrectly(
                s_currentRound,
                msg.sender
            );
        }
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = s_answer;
        publicInputs[1] = bytes32(uint256(uint160(msg.sender)));
        bool proofResult = s_verifier.verify(proof, publicInputs);

        if (!proofResult) {
            revert Panagram__InvalidProof();
        }

        s_lastCorrectGuessRound[msg.sender] = s_currentRound;
        if (s_currentRoundWinner == address(0)) {
            s_currentRoundWinner = msg.sender;
            _mint(msg.sender, 0, 1, "");
            emit Panagram__WinnerCrowned(msg.sender, s_currentRound);
        } else {
            _mint(msg.sender, 1, 1, "");
            emit Panagram__RunnerUpCrowned(msg.sender, s_currentRound);
        }

        return proofResult;
    }

    function setVerifier(IVerifier verifier) external onlyOwner {
        s_verifier = verifier;
        emit Panagram__VerifierUpdated(verifier);
    }

    function getCurrentRound() external view returns (uint256) {
        return s_currentRound;
    }

    function getCurrentRoundWinner() external view returns (address) {
        return s_currentRoundWinner;
    }

    function getAnswer() external view returns (bytes32) {
        return s_answer;
    }
}
