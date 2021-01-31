/**
 * WordPress dependencies
 */
import { useContext, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createHigherOrderComponent } from '@wordpress/compose';
import { BlockControls } from '@wordpress/block-editor';
import { addFilter, removeFilter } from '@wordpress/hooks';
import {
	__experimentalEditInPlaceControl as EditInPlaceControl,
	ToolbarGroup,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { MenuIdContext } from './index';

const untitledMenu = __( '(untitled menu)' );
const EditWithContext = ( { BlockEdit, saveMenu, blockEditProps } ) => {
	const menuId = useContext( MenuIdContext );
	const menu = useSelect( ( select ) => select( 'core' ).getMenu( menuId ), [
		menuId,
	] );
	const menuName = menu?.name ?? untitledMenu;
	return (
		<>
			<BlockEdit { ...blockEditProps } menuName={ menuName } />
			<BlockControls>
				<ToolbarGroup>
					<EditInPlaceControl
						label={ menuName }
						onUpdate={ ( value ) => {
							saveMenu( {
								...menu,
								name: value || untitledMenu,
							} );
						} }
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
};

export default function useNavigationBlockWithName() {
	const { saveMenu } = useDispatch( 'core' );

	useEffect( () => {
		const withMenuName = createHigherOrderComponent(
			( BlockEdit ) => ( props ) => {
				if ( props.name !== 'core/navigation' ) {
					return <BlockEdit { ...props } />;
				}
				return (
					<EditWithContext
						saveMenu={ saveMenu }
						BlockEdit={ BlockEdit }
						blockEditProps={ props }
					/>
				);
			},
			'withMenuName'
		);
		addFilter(
			'editor.BlockEdit',
			'core/edit-navigation/with-menu-name',
			withMenuName
		);
		return () =>
			removeFilter(
				'editor.BlockEdit',
				'core/edit-navigation/with-menu-name',
				withMenuName
			);
	}, [] );
}
