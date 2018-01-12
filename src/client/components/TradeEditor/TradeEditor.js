import React from 'react';
import PropTypes from 'prop-types';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import Articles from '../Articles/Articles';

import './TradeEditor.css';

const STEP_IDX_PARTNER_ARTICLES = 0;
const STEP_IDX_USER_ARTICLES = 1;
const STEP_IDX_SUMMARY = 2;

const STEP_LAST_IDX = 2;

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
        stepIndex: 0
    }

    canGoToPreviousStep = () => this.props.stepIndex > 0;

    canGotoNextStep = () => this.props.stepIndex < STEP_LAST_IDX;

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

    getStepTitle() {
        switch(this.props.stepIndex) {
            case STEP_IDX_PARTNER_ARTICLES:
                return 'Auswahl der gewünschten Artikel';

            case STEP_IDX_USER_ARTICLES:
                return 'Auswahl der eigenen Artikel';

            case STEP_IDX_SUMMARY:
                return 'Zusammenfassung';

            default:
                return 'INFO: Unbekannter Schritt!';
        }
    }

    getStepDescription() {
        switch(this.props.stepIndex) {
            case STEP_IDX_PARTNER_ARTICLES:
                return `Du kannst ein oder mehrere Artikel zum Tauschen auswählen. Du kannst aber nur Artikel von ${this.props.trade.tradePartner.name} auswählen.`;

            case STEP_IDX_USER_ARTICLES:
                return 'Du kannst ein oder mehrere eigenen Artikel zum Tauschen auswählen.';

            case STEP_IDX_SUMMARY:
                return 'Hier kannst Du sehen, welche Artikel Du ausgewählt hast. Wenn alles in Ordnung ist, kannst Du Deine Änderungen speichern.';

            default:
                return '';
        }
    }

    renderPartnerArticleChooser() {
        let otherPartnerArticles = this.props.partnerArticles.filter(article => !this.props.chosenPartnerArticles.some(a => a._id === article._id));

        return (
            <div>
                <Articles articles={this.props.chosenPartnerArticles} title={this.props.trade.partnerArticlesListTitle} isEditing={true} selected={true} filtering={false} onToggleArticle={this.props.togglePartnerArticle} />
                <Articles articles={otherPartnerArticles} title={`Weitere Artikel von ${this.props.trade.tradePartner.name}, die Du auswählen könntest`} isEditing={true} selected={false} filtering={true} filterText={this.props.partnerArticleFilterText} onFilterChange={this.props.setPartnerArticleFilterText} onToggleArticle={this.props.togglePartnerArticle} />
            </div>
        );
    }

    renderUserArticleChooser() {
        let otherUserArticles = this.props.userArticles.filter(article => !this.props.chosenUserArticles.some(a => a._id === article._id));

        return (
            <div>
                <Articles articles={this.props.chosenUserArticles} title={this.props.trade.userArticlesListTitle} isEditing={true} selected={true} filtering={false} onToggleArticle={this.props.toggleUserArticle} />
                <Articles articles={otherUserArticles} title="Weitere Artikel, die Du anbieten könntest:" isEditing={true} selected={false} filtering={true} filterText={this.props.userArticleFilterText} onFilterChange={this.props.setUserArticleFilterText} onToggleArticle={this.props.toggleUserArticle} />
            </div>
        );
    }

    renderSummary() {
        return (
            <div>
                <Articles articles={this.props.chosenPartnerArticles} title={this.props.trade.partnerArticlesListTitle} />
                <Articles articles={this.props.chosenUserArticles} title={this.props.trade.userArticlesListTitle} />
            </div>
        );
    }

    renderError() {

    }

    renderStep() {
        switch(this.props.stepIndex) {
            case STEP_IDX_PARTNER_ARTICLES:
                return this.renderPartnerArticleChooser();

            case STEP_IDX_USER_ARTICLES:
                return this.renderUserArticleChooser();

            case STEP_IDX_SUMMARY:
                return this.renderSummary();

            default:
                return this.renderError();
        }
    }

    render() {
        let title = this.props.trade ? `Tauschgeschäft mit ${this.props.trade.tradePartner.name}` : 'Unbekanntes Tauschgeschäft bearbeiten';
        let stepTitle = this.getStepTitle();
        let stepDescription = this.getStepDescription();

        let nextButton;
        if (this.props.stepIndex === STEP_LAST_IDX) {
            nextButton = <RaisedButton label="Speichern" secondary={true} onClick={this.props.onSave} />;
        } else {
            nextButton = <RaisedButton label="Nächster Schritt" primary={true} onClick={this.handleNext} />;
        }

        let navigation = (
            <div className="trade-editor__navigation-buttons">
                <FlatButton label="Abbrechen" onClick={this.props.onCancel} style={{marginRight: '48px'}} />
                <FlatButton label="Voriger Schritt" disabled={!this.canGoToPreviousStep()} onClick={this.handlePrev} style={{marginRight: '12px'}} />
                {nextButton}
            </div>
        );

        return (
            <div>
                <div className="trade-editor__navigation">
                    <h1 className="nowrap">{title}</h1>
                    <Stepper linear={false} activeStep={this.props.stepIndex}>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(STEP_IDX_PARTNER_ARTICLES)}>
                                Gewünschte Artikel auswählen
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(STEP_IDX_USER_ARTICLES)}>
                                Artikel um Tauschen
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(STEP_IDX_SUMMARY)}>
                                Zusammenfassung
                            </StepButton>
                        </Step>
                    </Stepper>
                    {navigation}
                </div>
                <div className="trade-editor__info-container">
                    <div>
                        <div>{stepTitle}</div>
                        <div>{stepDescription}</div>
                    </div>
                </div>
                <div className="trade-editor__step-container">
                    {this.renderStep()}
                </div>
            </div>
        );
    }
}
