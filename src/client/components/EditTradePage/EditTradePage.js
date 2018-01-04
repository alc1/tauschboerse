import React from 'react';
import PropTypes from 'prop-types';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import ApplicationBar from '../../containers/ApplicationBar';
import Articles from '../Articles/Articles';
import TradeDetail from '../TradeDetail/TradeDetail';
import TradeModel from '../../model/TradeModel';
import TradeAction from '../../constants/TradeAction';

import './EditTradePage.css';

export default class EditTradePage extends React.Component {

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        stepIndex: PropTypes.number.isRequired,
        userArticles: PropTypes.array,
        partnerArticles: PropTypes.array,
        chosenUserArticles: PropTypes.array,
        chosenPartnerArticles: PropTypes.array,
        loadTrade: PropTypes.func.isRequired,
        saveArticles: PropTypes.func.isRequired,
        toggleUserArticle: PropTypes.func.isRequired,
        togglePartnerArticle: PropTypes.func.isRequired,
        loadUserArticles: PropTypes.func.isRequired,
        loadPartnerArticles: PropTypes.func.isRequired,
        setStepIndex: PropTypes.func.isRequired,
        setLoading: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        history: PropTypes.object.isRequired
    };

    static defaultProps = {
        stepIndex: 0,
    }

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

    canGoToPreviousStep = () => this.props.stepIndex > 0

    canGotoNextStep = () => this.props.stepIndex < 3

    handlePrev = () => {
        if (this.canGoToPreviousStep()) {
            this.props.setStepIndex(this.props.stepIndex - 1);
        }
    };

    handleNext = () => {
        if (this.canGotoNextStep()) {
            this.props.setStepIndex(this.props.stepIndex + 1);
        }
    };

    handleCancel = () => {
        this.props.history.goBack();
    }

    handleSave = () => {

    }

    renderIntro() {
        return <p>Intro</p>;
    }

    renderPartnerArticleChooser() {
        let otherPartnerArticles = this.props.partnerArticles.filter(article => !this.props.chosenPartnerArticles.some(a => a._id === article._id));

        return (
            <div>
                <Articles articles={this.props.chosenPartnerArticles} title="Bla bla bla" isEditing={true} selected={true} filtering={false} toggleArticle={this.props.togglePartnerArticle} />
                <Articles articles={otherPartnerArticles} title="Bla bla bla" isEditing={true} selected={false} filtering={true} toggleArticle={this.props.togglePartnerArticle} />
            </div>
        );
    }

    renderUserArticleChooser() {
        let otherUserArticles = this.props.userArticles.filter(article => !this.props.chosenUserArticles.some(a => a._id === article._id));

        return (
            <div>
                <Articles articles={this.props.chosenUserArticles} title="Du bietest dafür folgende Artikel an:" isEditing={true} selected={true} filtering={false} toggleArticle={this.props.toggleUserArticle} />
                <Articles articles={otherUserArticles} title="Du bietest dafür folgende Artikel an:" isEditing={true} selected={false} filtering={true} toggleArticle={this.props.toggleUserArticle} />
            </div>
        );
    }

    renderSaveChanges() {
        return (
            <div>
                <Articles articles={this.props.chosenPartnerArticles} title="Bla bla bla" />
                <Articles articles={this.props.chosenUserArticles} title="Du bietest dafür folgende Artikel an:" />
                <RaisedButton label="Speichern" primary={true} onClick={this.handleSave} />
            </div>
        );
    }

    renderError() {

    }

    renderStep() {
        switch(this.props.stepIndex) {
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
        let navigation = (
            <div>
                <FlatButton label="Voriger Schritt" disabled={!this.canGoToPreviousStep()} onClick={this.handlePrev} style={{marginRight: '12px'}} />
                <RaisedButton label="Nächster Schritt" disabled={!this.canGotoNextStep()} primary={true} onClick={this.handleNext} style={{marginRight: '48px'}} />
                <FlatButton label="Abbrechen" onClick={this.handleCancel} />
            </div>
        );

        return (
            <div>
                <ApplicationBar subtitle="Tauschgeschäft bearbeiten"/>
                <div className="base-page">
                    {title}
                    <Stepper linear={false} activeStep={this.props.stepIndex}>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(0)}>
                                Intro
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(1)}>
                                Gewünschte Artikel auswählen
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(2)}>
                                Artikel um Tauschen
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(3)}>
                                Speichern
                            </StepButton>
                        </Step>
                    </Stepper>
                    {navigation}
                    <div className="tradeEditor-stepContainer">
                        {this.renderStep()}
                    </div>
                    {navigation}
                </div>
            </div>
        );
    }
}
