/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { useState, useRef, useEffect } from '@wordpress/element';
import { ENTER, ESCAPE } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import Button from '../button';

const baseInputCssClass = 'components-edit-in-place-control__input';
const beforeTransitionInputCssClass = 'small';
const afterTransitionInputCssClass = 'large';
const withoutTransitionCssClass = `${ baseInputCssClass } ${ beforeTransitionInputCssClass }`;
const withTransitionCssClass = `${ baseInputCssClass } ${ afterTransitionInputCssClass }`;
const cancelEvent = ( event ) => (
	event.preventDefault(), event.stopPropagation()
);

function EditInPlaceControl( { label = '', onClick = noop, onUpdate = noop } ) {
	const [ edit, setEdit ] = useState( false );
	const [ value, setValue ] = useState( label );
	const [ inputCssClasses, setInputCssClasses ] = useState(
		withoutTransitionCssClass
	);

	const prevValue = useRef();
	const inputRef = useRef();
	const buttonRef = useRef();

	useEffect( () => {
		prevValue.current = value;
		if ( edit ) {
			inputRef.current.focus();
			inputRef.current.select();
		} else {
			buttonRef.current.focus();
		}
	}, [ edit ] );

	return (
		<>
			{ edit ? (
				<input
					ref={ inputRef }
					className={ inputCssClasses }
					value={ value }
					onChange={ ( event ) => {
						setValue( event.target.value );
					} }
					onFocus={ () =>
						setInputCssClasses( withTransitionCssClass )
					}
					onBlur={ () => {
						setEdit( false );
						onUpdate( value );
						setInputCssClasses( withoutTransitionCssClass );
					} }
					onKeyDown={ ( event ) => {
						if ( ENTER === event.keyCode ) {
							cancelEvent( event );
							setEdit( ! edit );
							onUpdate( value );
						}
						if ( ESCAPE === event.keyCode ) {
							cancelEvent( event );
							setValue( prevValue.current );
						}
					} }
				/>
			) : (
				<Button
					ref={ buttonRef }
					className="components-edit-in-place-control__label"
					onClick={ () => {
						setEdit( true );
						onClick();
					} }
				>
					{ value }
				</Button>
			) }
		</>
	);
}

export default EditInPlaceControl;
