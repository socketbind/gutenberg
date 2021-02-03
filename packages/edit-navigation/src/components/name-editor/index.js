/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { useContext } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { MenuIdContext } from '../layout';
import { BlockControls } from '@wordpress/block-editor';
import {
	__experimentalEditInPlaceControl as EditInPlaceControl,
	ToolbarGroup,
} from '@wordpress/components';

const untitledMenu = __( '(untitled menu)' );
export default ( { BlockEdit, blockEditProps } ) => {
	const { saveMenu } = useDispatch( 'core' );
	const menuId = useContext( MenuIdContext );
	const menu = useSelect( ( select ) => select( 'core' ).getMenu( menuId ), [
		menuId,
	] );
	const menuName = menu?.name ?? untitledMenu;
	return (
		<>
			<BlockEdit
				{ ...blockEditProps }
				saveMenu={ saveMenu }
				menuName={ menuName }
			/>
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
