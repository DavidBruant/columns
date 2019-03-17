export default function(store){

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

            store.mutations.projectsStatus.setPending({pending: projectsP})

            projectsP
            .then(({data: projects}) => { store.mutations.setProjects({projects}) })
            .catch(error => { 
                console.error('getprojects', error)    
                store.mutations.projectsStatus.setError({error})
            })
        },

        setSourceProject(sourceProject, columnsByProject){
            store.mutations.setSourceProject({sourceProject})

            if(!columnsByProject.has(sourceProject)){
                const colsP = octokit.projects.getProjectColumns({project_id: sourceProject.id, per_page:100})

                store.mutations.sourceColumnsStatus.setPending({pending: colsP})

                colsP
                .then(({data: columns}) => {
                    console.log('store.mutations.addProjectColumns', sourceProject, columns)
                    store.mutations.addProjectColumns({project: sourceProject, columns}) 
                })
                .catch(error => store.mutations.sourceColumnsStatus.setError({error}))
            }
        },

        setDestinationProject(destinationProject, columnsByProject){
            store.mutations.setDestinationProject({destinationProject})

            if(!columnsByProject.has(destinationProject)){
                const colsP = octokit.projects.getProjectColumns({project_id: destinationProject.id, per_page:100})

                store.mutations.destinationColumnStatus.setPending({pending: colsP})

                colsP
                .then(({data: columns}) => store.mutations.addProjectColumns({project: destinationProject, columns}) )
                .catch(error => store.mutations.destinationColumnStatus.setError({error}))
            }
        },

        setSourceColumns(sourceColumns){
            store.mutations.setSourceColumns({sourceColumns})

            const {cardsByColumn = new WeakMap()} = store.state;
            
            const cardsPs = Promise.all(sourceColumns.map(column => {
                if(!cardsByColumn.has(column)){
                    return octokit.projects.getProjectCards({column_id: column.id, per_page: 100})
                    .then(({data: cards}) => {
                        store.mutations.setColumnCards({column, cards})
                    })
                }
                else
                    return Promise.resolve(true);

            }))
            .then(() => {
                const {sourceColumns, cardsByColumn} = store.state

                let cardsToCopy = []

                for(const col of sourceColumns){
                    cardsToCopy = [...cardsToCopy, ...cardsByColumn.get(col)]
                }

                store.mutations.setCardsToCopy({cardsToCopy})
            })
        },

        transfer(destinationColumn, cardsToCopy){
            const column_id = destinationColumn.id;

            return Promise.all(cardsToCopy.map(card => {
                if(card.note)
                    return octokit.projects.createProjectCard({ column_id, note: card.note })
                else{
                    return fetch(card.content_url)
                        .then(r => r.json())
                        .then(({id: content_id}) => {
                            return octokit.projects.createProjectCard({
                                column_id, 
                                content_id,
                                content_type: card.content_url.includes('issue') ? 'Issue' : 'PullRequest'
                            })
                        })
                }
            }))
        }
    }
}