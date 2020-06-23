export type BooleanStringInfo = {
	label: string,
	value: boolean
}

export type SiteType = {
	bauges: BooleanStringInfo,
	belledonne: BooleanStringInfo,
	caroux: BooleanStringInfo,
	chambord: BooleanStringInfo,
	chateauvilain: BooleanStringInfo,
	chize: BooleanStringInfo,
	grandbirieux: BooleanStringInfo,
	lapetitepierre: BooleanStringInfo,
	orlu: BooleanStringInfo,
	troisfontaines: BooleanStringInfo
}

export type ThemeType = {
	climat: BooleanStringInfo,
	activiteshumaines: BooleanStringInfo,
	utilisationspatiale: BooleanStringInfo,
	fonctionnementdemographique: BooleanStringInfo,
	regimealimentaire: BooleanStringInfo,
	suivisanitaire: BooleanStringInfo,

	suivisbiodiversite: BooleanStringInfo,
	travauxinterventions: BooleanStringInfo,
	gestionagricolepastorale: BooleanStringInfo,
	gestionforestiere: BooleanStringInfo,
	valorisationsformations: BooleanStringInfo
}
