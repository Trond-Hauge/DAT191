"use strict";

export function filterByName(item, search): boolean {
    if (!search) return true;
    return `${item.first_name} ${item.last_name}`.toLowerCase().includes(search.toLowerCase());
}

export function filterByDocument(item, search): boolean {
    if (!search) return true;
    return item.document_name.toLowerCase().includes(search.toLowerCase());
}

export function filterByOrganisation(item, search): boolean {
    if (!search) return true;
    return item.organisation_name.toLowerCase().includes(search.toLowerCase());
}

export function sortByName(item1, item2): number {
    return (item1.last_name + item1.first_name).toLowerCase().localeCompare((item2.last_name + item2.first_name).toLowerCase());
}

export function sortByDocument(item1, item2): number {
    return item1.document_name.toLowerCase().localeCompare(item2.document_name.toLowerCase());
}

export function sortByOrganisation(item1, item2): number {
    return item1.organisation_name.toLowerCase().localeCompare(item2.organisation_name.toLowerCase());
}