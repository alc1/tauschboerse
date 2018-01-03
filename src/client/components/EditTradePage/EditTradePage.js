import React from 'react';
import PropTypes from 'prop-types';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import ApplicationBar from '../../containers/ApplicationBar';
import ChosenArticles from '../ChosenArticles/ChosenArticles';
import TradeDetail from '../TradeDetail/TradeDetail';
import TradeModel from '../../model/TradeModel';
import TradeAction from '../../constants/TradeAction';

import './EditTradePage.css';

export default class EditTradePage extends React.Component {

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        userArticles: PropTypes.object,
        partnerArticles: PropTypes.object,
        loadTrade: PropTypes.func.isRequired,
        saveArticles: PropTypes.func.isRequired,
        startEditingUserArticles: PropTypes.func.isRequired,
        startEditingPartnerArticles: PropTypes.func.isRequired,
        cancelEditingUserArticles: PropTypes.func.isRequired,
        cancelEditingPartnerArticles: PropTypes.func.isRequired,
        toggleUserArticle: PropTypes.func.isRequired,
        togglePartnerArticle: PropTypes.func.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        loadPartnerArticles: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    state = {
        stepIndex: 0
    };

    componentDidMount() {
        this.props.setLoading(true);

        const { tradeId } = this.props.match.params;

        var loadPromises = [
            this.props.loadTrade(tradeId, this.props.user),
            this.props.loadUserArticles(this.props.user._id)
        ];
        Promise.all(loadPromises)
            .then(() => this.props.loadPartnerArticles(this.props.trade.tradePartner._id))
            .then(() => this.props.setLoading(false))
            .catch(() => this.props.setLoading(false));
    }

    componentWillReceiveProps(nextProps) {
    }

    handlePrev = () => {
        if (this.state.stepIndex > 0) {
            this.setState({ stepIndex: this.state.stepIndex - 1 });
        }
    };

    handleNext = () => {
        if (this.state.stepIndex < 3) {
            this.setState({ stepIndex: this.state.stepIndex + 1 });
        }
    };

    handleSave = () => {

    }

    renderIntro() {
        return <p>Intro</p>;
    }

    renderPartnerArticleChooser() {
        return (
            <ChosenArticles chosenArticles={this.props.partnerArticles.chosen} allArticles={this.props.partnerArticles.all} title="Bla bla bla" canEdit="true" isEditing="true" startEditing={this.startEditingPartnerArticles} cancelEditing={this.props.cancelEditingPartnerArticles} saveArticles={this.props.saveArticles} toggleArticle={this.props.togglePartnerArticle} />
        );
    }

    renderUserArticleChooser() {
        return (
            <ChosenArticles chosenArticles={this.props.userArticles.chosen} allArticles={this.props.userArticles.all} title="Du bietest dafür folgende Artikel an:" canEdit={this.props.trade.canEdit}  isEditing={this.props.userArticles.isEditing} startEditing={this.startEditingUserArticles} cancelEditing={this.props.cancelEditingUserArticles} saveArticles={this.props.saveArticles} toggleArticle={this.props.toggleUserArticle} />
        );
    }

    renderSaveChanges() {
        return (
            <div>
                <ChosenArticles chosenArticles={this.props.partnerArticles.chosen} allArticles={this.props.partnerArticles.all} title="Bla bla bla" canEdit={false} isEditing={false} startEditing={this.startEditingPartnerArticles} cancelEditing={this.props.cancelEditingPartnerArticles} saveArticles={this.props.saveArticles} toggleArticle={this.props.togglePartnerArticle} />
                <ChosenArticles chosenArticles={this.props.userArticles.chosen} allArticles={this.props.userArticles.all} title="Du bietest dafür folgende Artikel an:" canEdit={false}  isEditing={false} startEditing={this.startEditingUserArticles} cancelEditing={this.props.cancelEditingUserArticles} saveArticles={this.props.saveArticles} toggleArticle={this.props.toggleUserArticle} />
                <RaisedButton label="Speichern" primary={true} onClick={this.handleSave} />
            </div>
        );
    }

    renderError() {

    }

    renderStep() {
        switch(this.state.stepIndex) {
            case 0:
                return this.renderIntro();

            case 1:
                return this.renderPartnerArticleChooser();

            case 2:
                return this.renderUserArticleChooser();

            case 3:
                return this.renderSaveChanges();

            default:
                return this.renderError();
        }
    }

    render() {
        let title = this.props.trade ? <h1>Tauschgeschäft mit {this.props.trade.tradePartner.name}</h1> : <h1>Unbekanntes Tauschgeschäft</h1>;

        return (
            <div>
                <ApplicationBar subtitle="Tauschgeschäft bearbeiten"/>
                <div className="base-page">
                    {title}
                    <Stepper linear={false} activeStep={this.state.stepIndex}>
                    <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 0})}>
                                Intro
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 1})}>
                                Gewünschte Artikel auswählen
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 2})}>
                                Artikel um Tauschen
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 3})}>
                                Speichern
                            </StepButton>
                        </Step>
                    </Stepper>
                    <div className="tradeEditor-stepContainer">
                        {this.renderStep()}
                    </div>
                    <div>
                        <FlatButton label="Back" disabled={this.state.stepIndex === 0} onClick={this.handlePrev} style={{marginRight: 12}} />
                        <RaisedButton label="Next" disabled={this.state.stepIndex === 3} primary={true} onClick={this.handleNext} />
                    </div>
                </div>
            </div>
        );
    }
}
