import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import * as MicActions from '../actions/mic';
import { RouteComponentProps } from 'react-router';
import { IState } from '../reducers';

import { MicState } from '../reducers/mic';
import { Card, Intent, NonIdealState, Spinner, Text } from '@blueprintjs/core';
import { Result, ResultProps } from './result/Result';

import { ResultNode } from '../types';
import { Mic } from "../microphone/mic";

const styles = require('./MainPage.scss');

export interface MainPageProps extends RouteComponentProps<any> {
	mic: MicState;
}

enum SearchState {
	INIT,
	SPEAKING,
	FETCHING,
	DONE
}

interface MainPageState {
	searchState: SearchState;
	results: Array<ResultNode>;
}

class MainPage extends React.Component<MainPageProps, MainPageState> {
	microphone: Mic;

	readonly state: MainPageState = {
		searchState: SearchState.INIT,
		results: []
	};

	setResults(results: MainPageState['results']) {
		this.state.results = results;
	}

	componentDidMount() {
		let elem: HTMLElement = document.querySelector('.mic-icon') as HTMLElement;
		this.microphone = new Mic(elem, () => {
			this.setState({ searchState: SearchState.SPEAKING });
		}, (res) => {
			console.log(res);
		});
	}

	render() {
		return (
			<div className={styles.container}>
				<div className={styles.content}>
					{this.renderContent()}
				</div>
			</div>
		);
	}

	private renderContent = () => {
		const context = 'Stack Overflow';
		const understood = 'I want to...';

		const lorem = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' +
				'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s,' +
				'when an unknown printer took a galley of type and scrambled it to make a type specimen book.' +
				'It has survived not only five centuries, but also the leap into electronic typesetting,' +
				'remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset' +
				'sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker' +
				'including versions of Lorem Ipsum.';

		const results = [
			{ source: 'Stack Overflow', content: lorem },
			{ source: 'Lol wikia', content: lorem }
		];

		switch (this.state.searchState) {
			case SearchState.INIT:
				return (
						<NonIdealState
								icon="headset"
								title="Speak to search content"
								description="Plug a microphone and speak to begin"
						/>
				);
			case SearchState.SPEAKING:
				return (
					<>
						<Text>Keep speaking! >:3</Text>
						<div>La super barre de Sachdr</div>
					</>
				);
			case SearchState.FETCHING:
				return (
						<>
							{this.renderResultHead(context, understood)}
							{this.renderResults(results, true)}
						</>
				);
			case SearchState.DONE:
				return (
						<>
							{this.renderResultHead(context, understood)}
							{this.renderResults(results, false)}
						</>
				);
		}
	}

	private renderResultHead = (context: string, understood: string) => (
			<>
				<Text>Your query for the context {context}:</Text>

				<Card className={styles.understood}>
					<Text ellipsize={true}>{understood}</Text>
				</Card>
			</>
	)

	private renderResults = (results: ResultProps[], fetching: boolean) => {
		const bestGuess = '350 gold';
		return (
				<div className={styles.results}>
					{fetching ? <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_STANDARD}/> : (
						<>
							<Text className={styles.best_guess}>Best guess: {bestGuess}</Text>
							{results.map((el: ResultProps, index: number) => <Result key={index} {...el}/>)}
						</>
					)}
				</div>
		);
	}
}

function mapStateToProps(state: IState): Partial<MainPageProps> {
	return {
		mic: state.mic
	};
}

function mapDispatchToProps(dispatch: Dispatch<IState>): Partial<MainPageProps> {
	return bindActionCreators(MicActions as any, dispatch);
}

export default (connect(mapStateToProps, mapDispatchToProps)(MainPage) as any as React.StatelessComponent<MainPageProps>);
