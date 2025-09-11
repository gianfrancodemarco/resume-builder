export class JSONResume {
    constructor(data = {}) {
        this.basics = {
            name: data.basics?.name || '',
            label: data.basics?.label || '',
            image: data.basics?.image || '',
            email: data.basics?.email || '',
            phone: data.basics?.phone || '',
            url: data.basics?.url || '',
            summary: data.basics?.summary || '',
            location: {
                address: data.basics?.location?.address || '',
                postalCode: data.basics?.location?.postalCode || '',
                city: data.basics?.location?.city || '',
                countryCode: data.basics?.location?.countryCode || '',
                region: data.basics?.location?.region || ''
            },
            profiles: (data.basics?.profiles || []).map(p => ({
                network: p.network || '',
                username: p.username || '',
                url: p.url || ''
            }))
        };

        this.work = (data.work || []).map(w => ({
            name: w.name || '',
            position: w.position || '',
            url: w.url || '',
            startDate: w.startDate || '',
            endDate: w.endDate || '',
            summary: w.summary || '',
            highlights: w.highlights || []
        }));

        this.volunteer = (data.volunteer || []).map(v => ({
            organization: v.organization || '',
            position: v.position || '',
            url: v.url || '',
            startDate: v.startDate || '',
            endDate: v.endDate || '',
            summary: v.summary || '',
            highlights: v.highlights || []
        }));

        this.education = (data.education || []).map(e => ({
            institution: e.institution || '',
            url: e.url || '',
            area: e.area || '',
            studyType: e.studyType || '',
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            score: e.score || '',
            courses: e.courses || []
        }));

        this.awards = (data.awards || []).map(a => ({
            title: a.title || '',
            date: a.date || '',
            awarder: a.awarder || '',
            summary: a.summary || ''
        }));

        this.certificates = (data.certificates || []).map(c => ({
            name: c.name || '',
            date: c.date || '',
            issuer: c.issuer || '',
            url: c.url || ''
        }));

        this.publications = (data.publications || []).map(p => ({
            name: p.name || '',
            publisher: p.publisher || '',
            releaseDate: p.releaseDate || '',
            url: p.url || '',
            summary: p.summary || ''
        }));

        this.skills = (data.skills || []).map(s => ({
            name: s.name || '',
            level: s.level || '',
            keywords: s.keywords || []
        }));

        this.languages = (data.languages || []).map(l => ({
            language: l.language || '',
            fluency: l.fluency || ''
        }));

        this.interests = (data.interests || []).map(i => ({
            name: i.name || '',
            keywords: i.keywords || []
        }));

        this.references = (data.references || []).map(r => ({
            name: r.name || '',
            reference: r.reference || ''
        }));

        this.projects = (data.projects || []).map(p => ({
            name: p.name || '',
            startDate: p.startDate || '',
            endDate: p.endDate || '',
            description: p.description || '',
            highlights: p.highlights || [],
            url: p.url || ''
        }));
    }

    static createDefault() {
        return new JSONResume({
            basics: {
                name: 'John Doe',
                label: 'Programmer',
                image: '',
                email: 'john@gmail.com',
                phone: '(912) 555-4321',
                url: 'https://johndoe.com',
                summary: 'A summary of John Doe…',
                location: {
                    address: '2712 Broadway St',
                    postalCode: 'CA 94115',
                    city: 'San Francisco',
                    countryCode: 'US',
                    region: 'California'
                },
                profiles: [{
                    network: 'Twitter',
                    username: 'john',
                    url: 'https://twitter.com/john'
                }]
            },
            work: [{
                name: 'Company',
                position: 'President',
                url: 'https://company.com',
                startDate: '2013-01-01',
                endDate: '2014-01-01',
                summary: 'Description…',
                highlights: [
                    'Started the company'
                ]
            }],
            volunteer: [{
                organization: 'Organization',
                position: 'Volunteer',
                url: 'https://organization.com/',
                startDate: '2012-01-01',
                endDate: '2013-01-01',
                summary: 'Description…',
                highlights: [
                    'Awarded \'Volunteer of the Month\''
                ]
            }],
            education: [{
                institution: 'University',
                url: 'https://institution.com/',
                area: 'Software Development',
                studyType: 'Bachelor',
                startDate: '2011-01-01',
                endDate: '2013-01-01',
                score: '4.0',
                courses: [
                    'DB1101 - Basic SQL'
                ]
            }],
            awards: [{
                title: 'Award',
                date: '2014-11-01',
                awarder: 'Company',
                summary: 'There is no spoon.'
            }],
            certificates: [{
                name: 'Certificate',
                date: '2021-11-07',
                issuer: 'Company',
                url: 'https://certificate.com'
            }],
            publications: [{
                name: 'Publication',
                publisher: 'Company',
                releaseDate: '2014-10-01',
                url: 'https://publication.com',
                summary: 'Description…'
            }],
            skills: [{
                name: 'Web Development',
                level: 'Master',
                keywords: [
                    'HTML',
                    'CSS',
                    'JavaScript'
                ]
            }],
            languages: [{
                language: 'English',
                fluency: 'Native speaker'
            }],
            interests: [{
                name: 'Wildlife',
                keywords: [
                    'Ferrets',
                    'Unicorns'
                ]
            }],
            references: [{
                name: 'Jane Doe',
                reference: 'Reference…'
            }],
            projects: [{
                name: 'Project',
                startDate: '2019-01-01',
                endDate: '2021-01-01',
                description: 'Description...',
                highlights: [
                    'Won award at AIHacks 2016'
                ],
                url: 'https://project.com/'
            }]
        });
    }

    toJSON() {
        return {
            basics: this.basics,
            work: this.work,
            volunteer: this.volunteer,
            education: this.education,
            awards: this.awards,
            certificates: this.certificates,
            publications: this.publications,
            skills: this.skills,
            languages: this.languages,
            interests: this.interests,
            references: this.references,
            projects: this.projects
        };
    }

    static fromJSON(json) {
        return new JSONResume(json);
    }
} 