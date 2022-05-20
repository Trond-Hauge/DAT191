"use strict";

/**
 * Filter a list of objects based on first and last name.
 * @param item Object containing first_name and last_name properties.
 * @param search Query to filter by.
 * @returns true if the item passes the search query, false if not.
 */
export function filterByName(item, search): boolean {
    if (!search) return true;
    return `${item.first_name} ${item.last_name}`.toLowerCase().includes(search.toLowerCase());
}

/**
 * Filter a list of objects based on document title.
 * @param item Object containing document_name property.
 * @param search Query to filter by.
 * @returns true if the item passes the search query, false if not.
 */
export function filterByDocument(item, search): boolean {
    if (!search) return true;
    return item.document_name.toLowerCase().includes(search.toLowerCase());
}

/**
 * Filter a list of objects based on organisation name.
 * @param item Object containing organisation_name property.
 * @param search Query to filter by.
 * @returns true if the item passes the search query, false if not.
 */
export function filterByOrganisation(item, search): boolean {
    if (!search) return true;
    return item.organisation_name.toLowerCase().includes(search.toLowerCase());
}