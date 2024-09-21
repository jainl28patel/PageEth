import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { MessageReceived } from "../generated/schema"
import { MessageReceived as MessageReceivedEvent } from "../generated/Contract/Contract"
import { handleMessageReceived } from "../src/contract"
import { createMessageReceivedEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let srcEid = BigInt.fromI32(234)
    let message = "Example string value"
    let newMessageReceivedEvent = createMessageReceivedEvent(srcEid, message)
    handleMessageReceived(newMessageReceivedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MessageReceived created and stored", () => {
    assert.entityCount("MessageReceived", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MessageReceived",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "srcEid",
      "234"
    )
    assert.fieldEquals(
      "MessageReceived",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "message",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
