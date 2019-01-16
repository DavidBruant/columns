export default function({dispatch, getState}){

    let octokit;

    // in Octokit 16 (after https://github.com/octokit/rest.js/issues/1167 is fixed):
    // getRepoProjects => listForRepo
    // getOrgProjects => listForOrg

    return {
        set token(token){
            octokit = new Octokit()
            octokit.authenticate({ type: 'token', token })
        },

        getProjects(domain){
            let projectsP;
            
            if(domain.org){
                // org projects
                const {org} = domain;

                projectsP = octokit.projects.getOrgProjects({org, state: 'all', per_page: 100})
            }
            else{
                // repo projects
                const {owner, repo} = domain;

                projectsP = octokit.projects.getRepoProjects({owner, repo, state: 'all', per_page: 100})
            }

            dispatch.projectsStatus.setPending({pending: projectsP})

            projectsP
            .then(({data: projects}) => { dispatch.setProjects({projects}) })
            .catch(error => { 
                console.error('getprojects', error)    
                dispatch.projectsStatus.setError({error})
            })
        },

        setSourceProject(sourceProject, columnsByProject){
            dispatch.setSourceProject({sourceProject})

            if(!columnsByProject.has(sourceProject)){
                const colsP = octokit.projects.getProjectColumns({project_id: sourceProject.id, per_page:100})

                dispatch.sourceColumnsStatus.setPending({pending: colsP})

                colsP
                .then(({data: columns}) => {
                    console.log('dispatch.addProjectColumns', sourceProject, columns)
                    dispatch.addProjectColumns({project: sourceProject, columns}) 
                })
                .catch(error => dispatch.sourceColumnsStatus.setError({error}))
            }
        },

        setDestinationProject(destinationProject, columnsByProject){
            dispatch.setDestinationProject({destinationProject})

            if(!columnsByProject.has(destinationProject)){
                const colsP = octokit.projects.getProjectColumns({project_id: destinationProject.id, per_page:100})

                dispatch.destinationColumnStatus.setPending({pending: colsP})

                colsP
                .then(({data: columns}) => dispatch.addProjectColumns({project: destinationProject, columns}) )
                .catch(error => dispatch.destinationColumnStatus.setError({error}))
            }
        },

        setSourceColumns(sourceColumns){
            dispatch.setSourceColumns({sourceColumns})
            
            const cardsPs = Promise.all(sourceColumns.map(column => {
                return octokit.projects.getProjectCards({column_id: column.id, per_page: 100})
                .then(({data: cards}) => {
                    dispatch.addColumnCards({column, cards})
                })
            }))
            .then(() => {
                const {sourceColumns, cardsByColumn} = getState()

                let cardsToCopy = []

                for(const col of sourceColumns){
                    cardsToCopy = [...cardsToCopy, ...cardsByColumn.get(col)]
                }

                dispatch.setCardsToCopy({cardsToCopy})
            })
        }
    }
}