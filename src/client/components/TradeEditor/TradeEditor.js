import React from 'react';
import PropTypes from 'prop-types';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import Articles from '../Articles/Articles';

import './TradeEditor.css';

export default class TradeEditor extends React.Component {

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        stepIndex: PropTypes.number.isRequired,
        userArticles: PropTypes.array,
        partnerArticles: PropTypes.array,
        chosenUserArticles: PropTypes.array,
        chosenPartnerArticles: PropTypes.array,
        userArticleFilterText: PropTypes.string.isRequired,
        partnerArticleFilterText: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        toggleUserArticle: PropTypes.func.isRequired,
        togglePartnerArticle: PropTypes.func.isRequired,
        setStepIndex: PropTypes.func.isRequired,
        setUserArticleFilterText: PropTypes.func.isRequired,
        setPartnerArticleFilterText: PropTypes.func.isRequired
    };

    static defaultProps = {
        stepIndex: 0,
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

    renderIntro() {
        return <p>Intro</p>;
    }

    renderPartnerArticleChooser() {
        let otherPartnerArticles = this.props.partnerArticles.filter(article => !this.props.chosenPartnerArticles.some(a => a._id === article._id));

        return (
            <div>
                <Articles articles={this.props.chosenPartnerArticles} title="Bla bla bla" isEditing={true} selected={true} filtering={false} onToggleArticle={this.props.togglePartnerArticle} />
                <Articles articles={otherPartnerArticles} title="Bla bla bla" isEditing={true} selected={false} filtering={true} filterText={this.props.partnerArticleFilterText} onFilterChange={this.props.setPartnerArticleFilterText} onToggleArticle={this.props.togglePartnerArticle} />
            </div>
        );
    }

    renderUserArticleChooser() {
        let otherUserArticles = this.props.userArticles.filter(article => !this.props.chosenUserArticles.some(a => a._id === article._id));

        return (
            <div>
                <Articles articles={this.props.chosenUserArticles} title="Du bietest dafür folgende Artikel an:" isEditing={true} selected={true} filtering={false} onToggleArticle={this.props.toggleUserArticle} />
                <Articles articles={otherUserArticles} title="Du bietest dafür folgende Artikel an:" isEditing={true} selected={false} filtering={true} filterText={this.props.userArticleFilterText} onFilterChange={this.props.setUserArticleFilterText} onToggleArticle={this.props.toggleUserArticle} />
            </div>
        );
    }

    renderSaveChanges() {
        return (
            <div>
                <Articles articles={this.props.chosenPartnerArticles} title="Bla bla bla" />
                <Articles articles={this.props.chosenUserArticles} title="Du bietest dafür folgende Artikel an:" />
                <RaisedButton label="Speichern" primary={true} onClick={this.props.onSave} />
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
        let title = this.props.trade ? `Tauschgeschäft mit ${this.props.trade.tradePartner.name}` : 'Unbekanntes Tauschgeschäft';
        let navigation = (
            <div className="trade-editor__navigation-buttons">
                <FlatButton label="Voriger Schritt" disabled={!this.canGoToPreviousStep()} onClick={this.handlePrev} style={{marginRight: '12px'}} />
                <RaisedButton label="Nächster Schritt" disabled={!this.canGotoNextStep()} primary={true} onClick={this.handleNext} style={{marginRight: '48px'}} />
                <FlatButton label="Abbrechen" onClick={this.props.onCancel} />
            </div>
        );

        return (
            <div>
                <div className="trade-editor__navigation">
                    <h1 className="nowrap">{title}</h1>
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
                </div>
                <div className="trade-editor__step-container">
                    {this.renderStep()}
                </div>
            </div>
        );
    }
}
