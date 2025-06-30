// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Panagram} from "src/Panagram.sol";
import {HonkVerifier} from "src/Verifier.sol";
import {Test, console} from "forge-std/Test.sol";

contract PanagramTest is Test {
    Panagram public panagram;
    HonkVerifier public verifier;
    uint256 constant FIELD_MODULUS =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;
    bytes32 constant ANSWER =
        bytes32(
            uint256(
                keccak256(
                    abi.encodePacked(
                        bytes32(uint256(keccak256("triangles")) % FIELD_MODULUS)
                    )
                )
            ) % FIELD_MODULUS
        );

    bytes32 constant CORRECT_GUESS =
        bytes32(uint256(keccak256("triangles")) % FIELD_MODULUS);
    address user = makeAddr("user");
    address user2 = makeAddr("user2");

    function setUp() public {
        verifier = new HonkVerifier();
        panagram = new Panagram(verifier);
        panagram.newRound(ANSWER);
    }

    function _getProof(
        bytes32 guess,
        bytes32 correctAnswer,
        address sender
    ) internal returns (bytes memory _proof) {
        uint256 NUM_ARGS = 6;
        string[] memory inputs = new string[](NUM_ARGS);
        inputs[0] = "npx";
        inputs[1] = "tsx";
        inputs[2] = "js-scripts/generateProof.ts";
        inputs[3] = vm.toString(guess);
        inputs[4] = vm.toString(correctAnswer);
        inputs[5] = vm.toString(sender);

        bytes memory encodedProof = vm.ffi(inputs);
        _proof = abi.decode(encodedProof, (bytes));
        console.logBytes(_proof);
    }

    function testCorrectGuessPasses() public {
        vm.prank(user);
        bytes memory proof = _getProof(CORRECT_GUESS, ANSWER, user);
        panagram.makeGuess(proof);

        assertEq(panagram.balanceOf(user, 0), 1);
        assertEq(panagram.balanceOf(user, 1), 0);

        vm.prank(user);
        vm.expectRevert();
        panagram.makeGuess(proof);
    }

    function testSecondGuessPassed() public {
        vm.prank(user);
        bytes memory proof = _getProof(CORRECT_GUESS, ANSWER, user);
        panagram.makeGuess(proof);
        assertEq(panagram.balanceOf(user, 0), 1);
        assertEq(panagram.balanceOf(user, 1), 0);

        vm.prank(user2);
        bytes memory proof2 = _getProof(CORRECT_GUESS, ANSWER, user2);
        panagram.makeGuess(proof2);
        assertEq(panagram.balanceOf(user2, 0), 0);
        assertEq(panagram.balanceOf(user2, 1), 1);
    }

    function testStartNextRound() public {
        vm.prank(user);
        bytes memory proof = _getProof(CORRECT_GUESS, ANSWER, user);
        panagram.makeGuess(proof);
        assertEq(panagram.balanceOf(user, 0), 1);
        assertEq(panagram.balanceOf(user, 1), 0);

        vm.warp(panagram.MIN_DURATION() + 1);
        bytes32 NEW_ANSWER = bytes32(
            uint256(
                keccak256(
                    abi.encodePacked(
                        bytes32(
                            uint256(keccak256("rectangles")) % FIELD_MODULUS
                        )
                    )
                )
            ) % FIELD_MODULUS
        );
        panagram.newRound(NEW_ANSWER);
        assertEq(panagram.getCurrentRound(), 2);
        assertEq(panagram.getCurrentRoundWinner(), address(0));
        assertEq(panagram.getAnswer(), NEW_ANSWER);
    }

    function testIncorrectGuessFails() public {
        vm.prank(user);
        bytes32 INCORRECT_ANSWER = bytes32(
            uint256(
                keccak256(
                    abi.encodePacked(
                        bytes32(
                            uint256(keccak256("rectangles")) % FIELD_MODULUS
                        )
                    )
                )
            ) % FIELD_MODULUS
        );
        bytes32 INCORRECT_GUESS = bytes32(
            uint256(keccak256("rectangles")) % FIELD_MODULUS
        );
        bytes memory inccorrectProof = _getProof(
            INCORRECT_GUESS,
            INCORRECT_ANSWER,
            user
        );

        vm.expectRevert();
        panagram.makeGuess(inccorrectProof);
    }
}
