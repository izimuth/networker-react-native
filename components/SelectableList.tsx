import { useState, useEffect } from 'react';
import { FlatList, FlatListProps, ListRenderItem } from 'react-native';
import { List } from 'react-native-paper';

interface SelectableListProps<T extends object>
{
    /**
     * Items for list
     */
    items: T[];

    /**
     * List of items that are selected
     */
    selected: T[];

    /**
     * True if list should be in selection mode
     */
    selecting: boolean;

    /**
     * Name of key in T that should be considered the ID
     */
    idKey?: string;

    /**
     * Name of key in T that should be considered the text to display
     */
    titleKey?: string;

    /**
     * Optional Refresh control
     */
    refreshControl?: FlatListProps<T>['refreshControl'];

    /**
     * Disabled?
     */
    disabled?: boolean;

    /**
     * Called when the list is NOT selecting and a list item is tapped 
     * @param item Item contained in tapped item
     */
    onItemTap?: (item: T) => void;

    /**
     * Called when the list of selected items changes
     * @param values The new list of selected items
     */
    onSelectionChanged: (values: T[]) => void;

    /**
     * Called when the list wants to change its selection mode
     * @param mode The new selection mode
     */
    onSelectionModeChanged: (mode: boolean) => void;

	leftIcon?: string;
}

/**
 * A wrapper for React Native's FlatList that toggles item selection when the user long presses an item
 * TODO: Add a renderItem prop for custom list elements
 */
export function SelectableList<T extends object>(props: SelectableListProps<T>)
{
    // get id and title keys
    const idKey = props.idKey ?? 'id';
    const titleKey = props.titleKey ?? 'name';

    // check if an item is selected
    const isSelected = (item: T) => {
        return props.selected.find(x => x[idKey as keyof T] == item[idKey as keyof T]) != null;
    }

    // enable selection mode
    const enableSelecting = (firstItem: T) => {
        if (!props.selecting)
        {
            props.onSelectionModeChanged(true);
            props.onSelectionChanged([firstItem]);
        }
    }

    // add/remove an item from the current selections
    const toggleSelectedItem = (item: T) => {
        let newSelections: T[];

        // if currently selected, filter it out of the current selections and send new array
        if (isSelected(item))
        {
            newSelections = props.selected.filter(x => x[idKey as keyof T] != item[idKey as keyof T]);
        }
        // otherwise add to new selections
        else
        {
            newSelections = [...props.selected, item];
        }

        // send new selection list to owner
        props.onSelectionChanged(newSelections);
    }

    // called when an item in the list is tapped
    const onItemTap = (item: T) => {
        // if selecting then toggle selection
        if (props.selecting)
        {
            toggleSelectedItem(item);
        }
        // otherwise trigger tap logic
        else
        {
            props.onItemTap?.(item);
        }
    }

	const getListIcon = (item: T) => {
		let iconStr: string | undefined;

		if (props.selecting)
		{
			iconStr = isSelected(item) ? 'checkbox-outline' : 'checkbox-blank-outline';
		}
		else if (props.leftIcon)
		{
			iconStr = item[props.leftIcon as keyof T] as string;
		}

		if (iconStr)
			return (iconProps: any) => <List.Icon {...iconProps} icon={iconStr} />;
		else
			return undefined;
	}

    // renderItem callback for FlatList below
    const createListItem = (item: T) => {
		return <List.Item
			disabled={props.disabled}
			title={item[titleKey as keyof T] as string}
			left={getListIcon(item)}
			onPress={() => onItemTap(item)}
			onLongPress={() => enableSelecting(item)}
		/>
    };

    return (
        <FlatList
            data={props.items}
            refreshControl={props.refreshControl}
            renderItem={({ item }) => createListItem(item)}
        />
    );
}