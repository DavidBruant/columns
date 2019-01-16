
export default {
    setDomain(state, {domain}){
        return Object.assign(
            state, 
            {
                domain,
                projects: undefined,
                columnsByProject: undefined,
                cardsByColumn: undefined
            }
        )
    },
    setProjects(state, {projects}){
        console.log('mutation setProjects')

        return Object.assign(
            state,
            {
                projects,
                projectsStatus: undefined
            }
        )
    },
    setSourceProject(state, {sourceProject}){
        return Object.assign(
            state,
            {
                sourceProject,
                sourceColumns: undefined
            }
        )
    },
    setDestinationProject(state, {destinationProject}){
        return Object.assign(
            state,
            {
                destinationProject,
                destinationColumn: undefined
            }
        )
    },
    setSourceColumns(state, {sourceColumns}){
        return Object.assign(
            state,
            {sourceColumns}
        )
    },
    setDestinationColumn(state, {destinationColumn}){
        return Object.assign(
            state,
            {destinationColumn}
        )
    },

    setCardsToCopy(state, {cardsToCopy}){
        return Object.assign(
            state,
            {cardsToCopy}
        )
    },

    projectsStatus: {
        setPending(state, {pending}){
            return Object.assign(
                state,
                {projectsStatus: {pending}}
            )
        },
        setError(state, {error}){
            return Object.assign(
                state,
                {projectsStatus: {error}}
            )
        }
    },
    addProjectColumns(state, {project, columns}){
        const columnsByProject = state.columnsByProject || new WeakMap()
        let projectColumns = columnsByProject.get(project) || [];

        projectColumns = projectColumns.concat(columns);

        columnsByProject.set(project, projectColumns)

        return Object.assign(
            state,
            { columnsByProject }
        )
    },
    addColumnCards(state, {column, cards}){
        const cardsByColumn = state.cardsByColumn || new WeakMap()
        let columnCards = cardsByColumn.get(column) || [];

        columnCards = columnCards.concat(cards);

        cardsByColumn.set(column, columnCards)

        return Object.assign(
            state,
            { cardsByColumn }
        )
    },
    sourceColumnsStatus: {
        setPending(state, {pending}){
            return Object.assign(
                state,
                {sourceColumnsStatus: {pending}}
            )
        },
        setError(state, {error}){
            return Object.assign(
                state,
                {sourceColumnsStatus: {error}}
            )
        }
    },
    destinationColumnStatus: {
        setPending(state, {pending}){
            return Object.assign(
                state,
                {destinationColumnStatus: {pending}}
            )
        },
        setError(state, {error}){
            return Object.assign(
                state,
                {destinationColumnStatus: {error}}
            )
        }
    }
}
