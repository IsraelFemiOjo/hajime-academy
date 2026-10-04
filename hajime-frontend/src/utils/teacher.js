// Helpers for showing a teacher only their own subjects and classes.

// The teacher profile that belongs to the logged-in user
export function findMyTeacher(teachers, user) {
    return (teachers || []).find((teacher) => (teacher.userId?._id || teacher.userId) === user.id) || null
}

// Subjects this teacher is assigned to teach
export function subjectsTaughtBy(subjects, teacher) {
    if (!teacher) return []
    return (subjects || []).filter((subject) => (subject.teacher?._id || subject.teacher) === teacher._id)
}

// Ids of the classes where this teacher has at least one subject
export function classIdsOf(subjects) {
    return new Set(subjects.map((subject) => subject.className?._id || subject.className).filter(Boolean))
}
