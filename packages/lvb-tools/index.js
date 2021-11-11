import WhiteBoard from './src/tools/whiteBoard'
import Chat from './src/tools/chat'
import Asr from './src/tools/asr'
import Hand from './src/tools/hand'
import Share from './src/tools/share'

export default class LvbTools {}

/**
 * @function createChat
 * @return {Chat}
 */
LvbTools.createChat = function () {
  return new Chat()
}

/**
 * @function createAsr
 * @return {Asr}
 */
LvbTools.createAsr = function () {
  return new Asr()
}

/**
 * @function createWhiteboard
 * @return {WhiteBoard}
 */
LvbTools.createWhiteboard = function () {
  return new WhiteBoard()
}

/**
 * @function createHand
 * @return {Hand}
 */
LvbTools.createHand = function () {
  return new Hand()
}

/**
 * @function createShare
 * @return {Share}
 */
LvbTools.createShare = function () {
  return new Share()
}

/**
 * @type {{PAGE_GROUP_CHANGE: string, COURSEWARE_UPDATED: string, UPDATE_WHITEBOARD_COMPLETE: string, PAGE_CHANGE: string, USER_WB_STATE_CHANGE: string, DRAW_START: string, PREV_ACTIVE_PG_COMPLETE: string}}
 */
LvbTools.WbEvnets = WhiteBoard.WBEvents

/**
 * @type {{ENABLE_CHANGE: string, USER_NEW_CHAT_MESSAGE: string, SYSTEM_MESSAGE: string, PEER_SYSTEM_MESSAGE: string, PEER_NEW_CHAT_MESSAGE: string}}
 */
LvbTools.ChatEvents = Chat.ChatEvents

/**
 * @type {{USER_HAND_DOWN: string, USER_CAN_HAND_UP: string, USER_HAND_UP: string, USER_HAND_UP_ACK: string}}
 */
LvbTools.HandEvents = Hand.HandEvents
