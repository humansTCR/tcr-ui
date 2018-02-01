import React, { Component } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { List } from 'immutable'

import { colors } from '../../colors'

import UDappHOC from './HOC'

import H2 from '../../components/H2'
import Button from '../../components/Button'
import TopBar from '../../components/TopBar'
import Input from '../../components/Input'
import { BoldInlineText } from '../../components/Item'

import { withCommas, trimDecimalsThree } from '../../utils/value_utils'

const BigContainer = styled.div`
  display: grid;
  grid-gap: 15px;
  grid-template-columns: 1fr;
`
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 5px;
  border: 3px solid #${props => props.bgColor && props.bgColor.slice(-6)};
  border-radius: 4px;
`
export const Item = styled.div`
  padding: 0.7em;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  text-overflow: ellipsis;
`
const styles = {
  container: {
    padding: '0 2em 2em',
    overflow: 'hidden',
  },
  udappMethod: {
    width: '33%',
  },
}

const Wrapper = styled.div`
  padding: 1em;
`
const ModalMessage = styled.div`
  padding: 0 2em 2em;
`

const modalStyles = {
  overlay: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: '2',
  },
  content: {
    position: 'absolute',
    top: '5vh',
    left: '15vw',
    right: '15vw',
    maxWidth: '1300px',
    margin: '0 auto',
    backgroundColor: `${colors.greyBg}`,
    boxShadow: '0 0 20px 10px rgba(0, 0, 0, 0.2)',
    zIndex: '5',
    borderRadius: '10px',
    overflow: 'hidden',
  },
}
const Methods = styled.div`
  display: flex;
  flex-flow: column wrap;
  overflow: hidden;

  & > div {
    margin: 0.5em;
    display: flex;
    flex-flow: row wrap;
    overflow: hidden;

    & > div {
      min-width: 30%;
    }
  }
`
class UDapp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: props.isOpen,
    }
  }

  componentWillReceiveProps(newProps) {
    console.log('UDAPP newProps', newProps)
    if (List.isList(newProps.actions) && !List.isList(this.props.actions)) {
      this.setState({
        modalIsOpen: true,
      })
    }

    if (newProps.request && newProps.request.get('method')) {
      this.setState({
        modalIsOpen: true,
      })
    }
  }

  handleOpenModal = () => {
    console.log('Open UDAPP modal')
    this.setState({
      modalIsOpen: true,
    })
  }

  // handleCloseModal = () => {
  //   console.log('Close UDAPP modal')
  //   this.setState({
  //     modalIsOpen: false,
  //   })
  // }

  // handleAfterOpen = () => {
  //   console.log('after open', this)
  // }

  handleRequestClose = () => {
    console.log('after close', this)
    this.setState({
      modalIsOpen: false,
    })
  }
  // adapted from:
  // https://github.com/kumavis/udapp/blob/master/index.js#L310
  renderMethod(method, contract) {
    return (
      <div key={method.name} style={styles.udappMethod}>
        <h4>{`${method.name}`}</h4>
        {method.inputs.map((input, ind) => (
          <form
            key={input.name + ind + method.name}
            onSubmit={e =>
              method.constant
                ? this.props.hocCall(e, method, contract)
                : this.props.hocSendTransaction(e, method, contract)
            }
          >
            {input.name !== '_data' ? (
              // TODO: enable so that the defaultValue actually works without
              // ...having to re-input
              <Input
                id={input.name}
                placeholder={`${input.name} (${input.type})`}
                defaultValue={
                  input.name === '_voter' || input.name === '_owner'
                    ? `${this.props.account}`
                    : input.name === '_listingHash'
                      ? this.props.request.getIn(['context', 'listing'])
                      : ''
                }
                onChange={e => this.props.hocInputChange(e, method, input)}
              />
            ) : (
              false
            )}
          </form>
        ))}
        {method.constant ? (
          <Button onClick={e => this.props.hocCall(e, method, contract)}>{'CALL'}</Button>
        ) : (
          <Button onClick={e => this.props.hocSendTransaction(e, method, contract)}>
            {'SEND TXN'}
          </Button>
        )}
        {method.constant && this.props.currentMethod === method.name
          ? ` -> ${this.props.callResult}`
          : false}
        <br />
        <br />
      </div>
    )
  }

  // adapted from:
  // https://github.com/kumavis/udapp/blob/master/index.js#L205
  render() {
    const tokenBalance =
      this.props.wallet && this.props.wallet.getIn(['token', 'tokenBalance'])
    const votingRights =
      this.props.wallet &&
      this.props.wallet.getIn([
        'token',
        'allowances',
        this.props.voting.address,
        'votingRights',
      ])
    const votingAllowance =
      this.props.wallet &&
      this.props.wallet.getIn(['token', 'allowances', this.props.voting.address, 'total'])
    const registryAllowance =
      this.props.wallet &&
      this.props.wallet.getIn([
        'token',
        'allowances',
        this.props.registry.address,
        'total',
      ])

    const context = this.props.request && this.props.request.get('context')
    const requestMethod = this.props.request && this.props.request.get('method')

    const visibleRegistryMethods = (this.props.registry.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' &&
        this.props.actions.includes(methodInterface.name) &&
        methodInterface.inputs.length > 0
    )
    const visibleTokenMethods = (this.props.token.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' &&
        this.props.actions.includes(methodInterface.name) &&
        methodInterface.inputs.length > 0
    )
    const visibleVotingMethods = (this.props.voting.abi || []).filter(
      methodInterface =>
        methodInterface.type === 'function' &&
        this.props.actions.includes(methodInterface.name) &&
        methodInterface.inputs.length > 0
    )

    return (
      <div style={styles.container}>
        <Wrapper>
          <ReactModal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.handleAfterOpen}
            onRequestClose={this.handleRequestClose}
            style={modalStyles}
            contentLabel="UDapp Modal"
            portalClassName="UDappModalPortal"
            overlayClassName="UDappModal__Overlay"
            className="UDappModal__Content"
            bodyOpenClassName="UDappModal__Body--open"
            ariaHideApp={false}
            shouldFocusAfterRender={false}
            shouldCloseOnEsc={true}
            shouldReturnFocusAfterClose={true}
            role="dialog"
          >
            <TopBar />
            <H2>{this.props.messages.heading}</H2>
            {this.props.messages.default ? (
              <ModalMessage>{this.props.messages.default}</ModalMessage>
            ) : (
              false
            )}
            {this.props.messages.instructions ? (
              <ModalMessage>{this.props.messages.instructions}</ModalMessage>
            ) : (
              false
            )}

            <Methods>
              <div>
                <BigContainer>
                  <Container bgColor={this.props.token.address}>
                    <Item gR={1}>
                      <BoldInlineText>
                        {'Token Balance: '}
                        {tokenBalance && withCommas(trimDecimalsThree(tokenBalance))}
                      </BoldInlineText>
                    </Item>
                    <Item gR={2}>
                      {visibleTokenMethods.map(one => this.renderMethod(one, 'token'))}
                    </Item>
                  </Container>

                  <Container bgColor={this.props.registry.address}>
                    <Item gR={1}>
                      <BoldInlineText>
                        {'REGISTRY: ' + this.props.registry.address}
                      </BoldInlineText>
                    </Item>
                    <Item gR={2}>
                      <BoldInlineText>
                        {`Allowance: `}
                        {registryAllowance && withCommas(registryAllowance)}
                      </BoldInlineText>
                    </Item>
                    <Item gR={3}>
                      {visibleRegistryMethods.map(one =>
                        this.renderMethod(one, 'registry')
                      )}
                    </Item>
                  </Container>

                  <Container bgColor={this.props.voting.address}>
                    <Item gR={1}>
                      <BoldInlineText>
                        {'VOTING: ' + this.props.voting.address}
                      </BoldInlineText>
                    </Item>
                    <Item gR={2}>
                      <BoldInlineText>
                        {'Allowance: '}
                        {votingAllowance && withCommas(votingAllowance)}
                      </BoldInlineText>
                    </Item>
                    <Item gR={3}>
                      <BoldInlineText>
                        {'Voting Rights: '}
                        {votingRights && withCommas(votingRights)}
                      </BoldInlineText>
                    </Item>
                    <Item gR={4}>
                      {visibleVotingMethods.map(one => this.renderMethod(one, 'voting'))}
                    </Item>
                  </Container>
                </BigContainer>
                {/* <Item gR={5} gC={4}>
        <BoldInlineText>
          {'Voting Balance: '}
          {votingBalance && withCommas(votingBalance)}
        </BoldInlineText>
      </Item>
      <Item gR={6} gC={4}>
        <BoldInlineText>
          {'Locked Tokens: '}
          {lockedTokens && withCommas(lockedTokens)}
        </BoldInlineText>
      </Item> */}
              </div>
            </Methods>
          </ReactModal>

          <Button onClick={this.handleOpenModal}>{`UDAPP - ${
            this.props.messages.name
          }`}</Button>
        </Wrapper>
      </div>
    )
  }
}

export default UDappHOC(UDapp)
