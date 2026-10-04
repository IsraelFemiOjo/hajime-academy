// Small helpers for showing data on the dashboard pages.

// "Chidi Okeke" from anything with firstName and lastName.
// Shows a dash if the record was deleted.
export function fullName(person) {
    if (!person) return '—'
    return `${person.firstName || ''} ${person.lastName || ''}`.trim() || '—'
}

// "14 May 2011" from a date like "2011-05-14" or "2011-05-14T00:00:00.000Z"
export function formatDate(value) {
    if (!value) return '—'
    // A plain "2026-10-04" is read as a local date, so it never shifts a day
    const plainDate = /^\d{4}-\d{2}-\d{2}$/.test(value)
    const date = plainDate ? new Date(`${value}T00:00:00`) : new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Today's date as YYYY-MM-DD, the format the backend uses for attendance
export function todayString() {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${now.getFullYear()}-${month}-${day}`
}

// True if the search text appears in any of the given values
export function matchesSearch(searchText, values) {
    const text = searchText.trim().toLowerCase()
    if (!text) return true
    return values.some((value) => String(value || '').toLowerCase().includes(text))
}

// Subjects are saved with their class attached, e.g. "Mathematics (JSS 1A)",
// because the backend only allows each subject name once in the whole school.
// This shows just "Mathematics" on screen.
export function subjectName(subject) {
    if (!subject?.name) return '—'
    return subject.name.replace(/\s*\([^)]*\)$/, '')
}

// What actually gets saved for a subject in a class:
//   "Mathematics" + "JSS 1A"  ->  name "Mathematics (JSS 1A)", code "MATHEMATICS-JSS1A"
export function subjectForClass(plainName, className) {
    const name = plainName.trim()
    const toCode = (text) => text.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '')
    return {
        name: `${name} (${className})`,
        code: `${toCode(name)}-${toCode(className).replace(/-/g, '')}`,
    }
}
