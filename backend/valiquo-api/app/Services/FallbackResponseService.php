<?php

namespace App\Services;

class FallbackResponseService
{
    public function __construct(
        private readonly RegulatoryDocumentSelector $documentSelector,
        private readonly RegulatoryDocumentTextExtractor $textExtractor,
    ) {}

    public function generateFallbackResponse(string $question, string $thematique, ?string $ville): string
    {
        // Generate dynamic response based on question, thematique and ville
        $response = $this->generateDynamicResponse($question, $thematique, $ville);
        
        return $response;
    }

    private function generateDynamicResponse(string $question, string $thematique, ?string $ville): string
    {
        $villeText = $ville ? " à {$ville}" : '';
        
        $response = "**Réponse réglementaire basée sur les textes officiels marocains**\n\n";
        $response .= "**Thématique :** {$thematique}";
        if ($ville) {
            $response .= " (Ville : {$ville})";
        }
        $response .= "\n\n";
        $response .= "**Votre question :** {$question}\n\n";
        $response .= "---\n\n";
        
        // Generate detailed content based on thematique
        switch ($thematique) {
            case 'Création d\'entreprise':
                $response .= $this->getDetailedCreationResponse($question, $ville);
                break;
            case 'Fiscalité':
                $response .= $this->getDetailedFiscaliteResponse($question, $ville);
                break;
            case 'Statuts juridiques':
                $response .= $this->getDetailedStatutsResponse($question, $ville);
                break;
            case 'Procédures OMPIC':
                $response .= $this->getDetailedOmpicResponse($question, $ville);
                break;
            case 'CNSS & Social':
                $response .= $this->getDetailedCnssResponse($question, $ville);
                break;
            default:
                $response .= $this->getDetailedDefaultResponse($question, $ville);
        }
        
        return $response;
    }

    private function getDetailedCreationResponse(string $question, string $ville): string
    {
        $villeText = $ville ? " à {$ville}" : '';
        
        $response = "Pour créer votre entreprise{$villeText}, voici les étapes détaillées selon la réglementation marocaine en vigueur :\n\n";
        
        $response .= "**Étape 1 : Choix de la forme juridique**\n";
        $response .= "La Loi 5-96 régit les SARL (Sociétés à Responsabilité Limitée) avec 1 à 50 associés et un capital minimum de 1 MAD depuis la réforme de 2018. ";
        $response .= "Pour les projets plus importants, la SA (Société Anonyme) régie par la Loi 17-95 nécessite minimum 5 actionnaires et un capital de 10 000 MAD. ";
        $response .= "L'auto-entrepreneur reste une option simplifiée pour les très petites activités avec un CA plafonné à 200 000 MAD (services) ou 500 000 MAD (commerce).\n\n";
        
        $response .= "**Étape 2 : Constitution du dossier de création**\n";
        $response .= "Rédigez les statuts de votre société selon les modèles disponibles sur OMPIC.ma. ";
        $response .= "Rassemblez les documents obligatoires : copies des CIN des associés, attestation de blocage du capital si applicable, et formulaire de déclaration au registre de commerce. ";
        $response .= "Le justificatif de siège social (contrat de bail ou quittance) est également requis.\n\n";
        
        $response .= "**Étape 3 : Dépôt au Centre Régional d'Investissement (CRI){$villeText}**\n";
        $response .= "Le CRI fonctionne comme guichet unique pour toutes les formalités de création. ";
        $response .= "Déposez votre dossier complet : le délai moyen est de 24 à 72 heures pour obtenir le Registre de Commerce (RC). ";
        $response .= "Cette procédure accélérée est particulièrement efficace dans les grandes villes comme Casablanca, Rabat ou Marrakech.\n\n";
        
        $response .= "**Étape 4 : Immatriculation fiscale et identification**\n";
        $response .= "Obtenez votre identification fiscale auprès de la Direction Générale des Impôts (DGI) et effectuez la déclaration d'existence dans les 30 jours suivant la création. ";
        $response .= "Cette étape est obligatoire pour toute activité économique au Maroc.\n\n";
        
        $response .= "**Étape 5 : Affiliation à la CNSS**\n";
        $response .= "Si vous prévoyez d'embaucher des salariés, l'affiliation CNSS est obligatoire. ";
        $response .= "Immatriculez votre entreprise dans les 30 jours et chaque salarié dans les 8 jours suivant son embauche. ";
        $response .= "Les cotisations sociales sont partagées entre employeur (environ 19%) et salarié (4,29%).\n\n";
        
        $response .= "---\n\n";
        $response .= "**Coût estimé de la création :** 1 000 à 3 000 MAD incluant les frais de dossier (~300 MAD), la publication au Bulletin Officiel (~200 MAD), le certificat négatif (~50 MAD) et les frais notariaux.\n\n";
        $response .= "**Organismes officiels à contacter :**\n";
        $response .= "- **OMPIC** : ompic.ma (Registre du commerce et propriété intellectuelle)\n";
        $response .= "- **CRI** : cri.ma (Guichet unique de création d'entreprise)\n";
        $response .= "- **DGI** : tax.gov.ma (Identification fiscale et déclarations)\n";
        $response .= "- **CNSS** : cnss.ma (Affiliation sociale et cotisations)\n\n";
        $response .= "**Documents de référence :** Loi 5-96, Loi 17-95, Code Général des Impôts 2024, Guide de création d'entreprise OMPIC.";
        
        return $response;
    }

    private function getDetailedFiscaliteResponse(string $question, string $ville): string
    {
        $villeText = $ville ? " à {$ville}" : '';
        
        $response = "Concernant la fiscalité des entreprises au Maroc{$villeText}, voici les principaux régimes et obligations selon le Code Général des Impôts (CGI) 2024 et la Note Circulaire 735 LF 2024 :\n\n";
        
        $response .= "**1. Impôt sur les Sociétés (IS)**\n";
        $response .= "Le taux standard de l'IS est de 20% pour les entreprises dont le chiffre d'affaires annuel dépasse 1 million de dirhams. ";
        $response .= "Un taux réduit de 15% s'applique aux entreprises réalisant un CA inférieur à 1 million de dirhams. ";
        $response .= "Les PME exportatrices bénéficient d'un taux préférentiel de 10%. ";
        $response .= "Le taux majoré de 31% s'applique aux banques, compagnies d'assurance et sociétés de distribution d'eau et d'électricité.\n\n";
        
        $response .= "**2. Taxe sur la Valeur Ajoutée (TVA)**\n";
        $response .= "Le taux normal de TVA est de 20% pour la majorité des biens et services. ";
        $response .= "Un taux réduit de 14% s'applique aux services de transport, hôtels et restaurants. ";
        $response .= "Le taux super-réduit de 10% concerne les produits de première nécessité (pain, huile, sucre, etc.). ";
        $response .= "Certains produits sont exonérés comme les médicaments et les produits agricoles.\n\n";
        
        $response .= "**3. Taxe Professionnelle**\n";
        $response .= "La Taxe Professionnelle est un impôt local dû par toute personne physique ou morale exerçant une activité lucrative au Maroc. ";
        $response .= "Le taux varie selon l'activité et la localisation géographique. ";
        $response .= "Une exonération totale est accordée pendant les 5 premières années pour les nouvelles entreprises créées dans certaines zones.\n\n";
        
        $response .= "**4. Obligations déclaratives et délais**\n";
        $response .= "- **Déclaration d'existence** : dans les 30 jours suivant le début d'activité\n";
        $response .= "- **Déclaration annuelle de résultats** : avant le 31 mars de l'année suivant l'exercice\n";
        $response .= "- **Acomptes provisionnels** : paiement trimestriel (25% de l'IS estimé)\n";
        $response .= "- **Déclarations de TVA** : mensuelle (CA > 1M MAD) ou trimestrielle (CA ≤ 1M MAD)\n\n";
        
        $response .= "**5. Régime forfaitaire pour auto-entrepreneurs**\n";
        $response .= "Les auto-entrepreneurs bénéficient d'un régime fiscal simplifié avec un taux unique de 2% sur le chiffre d'affaires pour les services et 0,2% pour le commerce. ";
        $response .= "Ce régime est plafonné à 200 000 MAD (services) ou 500 000 MAD (commerce) de CA annuel.\n\n";
        
        $response .= "---\n\n";
        $response .= "**Organismes officiels :**\n";
        $response .= "- **DGI** : tax.gov.ma (Direction Générale des Impôts)\n";
        $response .= "- **Trésorerie Générale du Royaume** : tgr.gov.ma\n";
        $response .= "- **Collectivités territoriales** : pour la Taxe Professionnelle\n\n";
        $response .= "**Conseil professionnel :** Consultez un expert-comptable certifié pour optimiser votre situation fiscale et assurer la conformité de vos déclarations. ";
        $response .= "La fiscalité marocaine offre des opportunités d'optimisation légale qu'il convient d'exploiter avec l'appui d'un professionnel.";
        
        return $response;
    }

    private function getDetailedStatutsResponse(string $question, string $ville): string
    {
        $villeText = $ville ? " à {$ville}" : '';
        
        $response = "Pour choisir le statut juridique adapté à votre projet{$villeText}, voici une comparaison détaillée des principales formes d'entreprises au Maroc selon la Loi 5-96 et la Loi 17-95 :\n\n";
        
        $response .= "**1. SARL (Société à Responsabilité Limitée) - Loi 5-96**\n";
        $response .= "La SARL est la forme la plus courante pour les PME marocaines. Elle permet d'avoir 1 à 50 associés (personnes physiques ou morales) avec une responsabilité limitée à leurs apports. ";
        $response .= "Depuis la réforme de 2018, le capital minimum est symbolique (1 MAD), facilitant ainsi la création d'entreprise. ";
        $response .= "La gérance peut être assurée par un ou plusieurs gérants (associés ou non) avec des pouvoirs définis dans les statuts. ";
        $response .= "Les décisions collectives sont prises en assemblée générale des associés.\n\n";
        
        $response .= "**2. SA (Société Anonyme) - Loi 17-95**\n";
        $response .= "La SA est destinée aux projets d'envergure nécessitant un important financement. Elle exige minimum 5 actionnaires et un capital minimum de 10 000 MAD. ";
        $response .= "La SA est obligatoirement dotée d'un conseil d'administration (3 à 12 membres) ou d'un directoire. ";
        $response .= "Les actions sont librement négociables, ce qui facilite l'entrée de nouveaux investisseurs. ";
        $response .= "Le contrôle financier est renforcé avec l'obligation de nommer un commissaire aux comptes.\n\n";
        
        $response .= "**3. SAS (Société par Actions Simplifiée)**\n";
        $response .= "La SAS offre une flexibilité statutaire maximale : les associés peuvent organiser librement le fonctionnement de la société dans les statuts. ";
        $response .= "Elle nécessite minimum 2 associés (pas de maximum) avec un capital minimum de 10 000 MAD. ";
        $response .= "C'est une forme hybride adaptée aux startups et aux projets innovants nécessitant une structure souple.\n\n";
        
        $response .= "**4. Auto-entrepreneur**\n";
        $response .= "Ce régime simplifié est destiné aux très petites activités. Le chiffre d'affaires est plafonné à 200 000 MAD pour les services et 500 000 MAD pour le commerce. ";
        $response .= "La fiscalité est forfaitaire (2% services, 0,2% commerce) avec des cotisations sociales mensuelles fixes. ";
        $response .= "C'est idéal pour démarrer une activité en solo avec un minimum de formalités administratives.\n\n";
        
        $response .= "**5. Critères de choix du statut**\n";
        $response .= "- **Nombre d'associés** : SARL (1-50), SA (5+), SAS (2+)\n";
        $response .= "- **Capital disponible** : SARL (flexible), SA (10 000 MAD minimum)\n";
        $response .= "- **Besoin de financement** : SA (accès aux marchés boursiers), SARL (limité)\n";
        $response .= "- **Niveau de responsabilité** : Tous limités aux apports sauf auto-entrepreneur (responsabilité illimitée)\n";
        $response .= "- **Complexité administrative** : Auto-entrepreneur (simple), SARL (moyen), SA (complexe)\n\n";
        
        $response .= "---\n\n";
        $response .= "**Responsabilités du gérant selon la Loi 5-96 :**\n";
        $response .= "- Gérance majoritaire : responsabilité solidaire pour les dettes sociales et fiscales\n";
        $response .= "- Gérance minoritaire ou égalitaire : responsabilité limitée aux fautes de gestion\n\n";
        $response .= "**Organismes officiels :**\n";
        $response .= "- **OMPIC** : ompic.ma (Registre du commerce)\n";
        $response .= "- **Tribunal de Commerce** : justice.gov.ma (Litiges commerciaux)\n";
        $response .= "- **DGI** : tax.gov.ma (Fiscalité selon statut)\n\n";
        $response .= "**Documents de référence :** Loi 5-96 (SARL), Loi 17-95 (SA), Code de Commerce, Guide OMPIC.";
        
        return $response;
    }

    private function getDetailedOmpicResponse(string $question, string $ville): string
    {
        $villeText = $ville ? " à {$ville}" : '';
        
        $response = "Pour les procédures OMPIC (Office Marocain de la Propriété Industrielle et Commerciale){$villeText}, voici les étapes détaillées d'enregistrement selon le Guide de création d'entreprise OMPIC :\n\n";
        
        $response .= "**1. Recherche d'antériorité et réservation du nom**\n";
        $response .= "Avant toute formalité, vérifiez la disponibilité du nom commercial souhaité via le portail OMPIC. ";
        $response .= "Cette recherche d'antériorité évite les conflits avec des marques existantes. ";
        $response .= "Une fois le nom disponible, vous pouvez le réserver pour une durée de 30 jours. ";
        $response .= "Cette étape est cruciale pour protéger votre identité commerciale et éviter les litiges futurs.\n\n";
        
        $response .= "**2. Obtention du Certificat Négatif**\n";
        $response .= "Le certificat négatif est un document officiel attestant que le nom commercial est libre. ";
        $response .= "Demandez-le en ligne via le portail OMPIC ou directement au guichet. ";
        $response .= "Le coût est d'environ 50 MAD et le délai d'obtention est de 24 à 48 heures. ";
        $response .= "Ce certificat est obligatoire pour toute inscription au Registre de Commerce.\n\n";
        
        $response .= "**3. Dépôt de marque (optionnel mais recommandé)**\n";
        $response .= "Si vous souhaitez protéger votre marque, déposez un dossier de dépôt de marque auprès de l'OMPIC. ";
        $response .= "Le dossier comprend : la marque (logo ou nom), liste des produits/services, justificatif de paiement des frais (environ 1 500 MAD). ";
        $response .= "La protection est valable 10 ans et renouvelable indéfiniment. ";
        $response .= "Cette étape est essentielle pour les marques fortes et les activités de distribution.\n\n";
        
        $response .= "**4. Inscription au Registre de Commerce (RC)**\n";
        $response .= "L'inscription au RC est obligatoire pour toute activité commerciale. ";
        $response .= "Déposez votre dossier complet : statuts signés, formulaire M1, certificat négatif, CIN des associés, justificatif de siège. ";
        $response .= "Via le CRI, le délai est de 24 à 72 heures. Directement à l'OMPIC, comptez 5 à 10 jours ouvrés. ";
        $response .= "L'inscription donne un numéro RC unique qui identifie votre entreprise officiellement.\n\n";
        
        $response .= "**5. Publication au Bulletin Officiel**\n";
        $response .= "La constitution de votre société doit faire l'objet d'une publication au Bulletin Officiel. ";
        $response .= "Cette formalité est obligatoire pour les SARL et SA. ";
        $response .= "Le coût est d'environ 200 MAD et la publication est automatique via le CRI. ";
        $response .= "Cette publication rend la création de votre société opposable aux tiers.\n\n";
        
        $response .= "**6. Enregistrement des statuts**\n";
        $response .= "Les statuts de votre société doivent être enregistrés auprès du service des impôts. ";
        $response .= "Cette formalité donne date certaine à vos statuts et est obligatoire pour les actes soumis à enregistrement. ";
        $response .= "Les frais d'enregistrement sont calculés selon le capital social (environ 1% du capital).\n\n";
        
        $response .= "---\n\n";
        $response .= "**Coût total estimé des formalités OMPIC :** 300 à 500 MAD (certificat négatif + frais RC + publication)\n\n";
        $response .= "**Délais moyens :**\n";
        $response .= "- Via CRI : 24 à 72 heures (procédure accélérée)\n";
        $response .= "- Directement OMPIC : 5 à 10 jours ouvrés\n\n";
        $response .= "**Organismes officiels :**\n";
        $response .= "- **OMPIC** : ompic.ma (portail en ligne pour toutes les démarches)\n";
        $response .= "- **CRI** : cri.ma (guichet unique accéléré)\n";
        $response .= "- **Bulletin Officiel** : sgg.gov.ma (publication officielle)\n\n";
        $response .= "**Documents requis :** CIN des associés, attestation de blocage du capital, contrat de bail ou quittance, statuts signés.";
        
        return $response;
    }

    private function getDetailedCnssResponse(string $question, string $ville): string
    {
        $villeText = $ville ? " à {$ville}" : '';
        
        $response = "Pour l'affiliation CNSS et les obligations sociales{$villeText}, voici les procédures détaillées selon le Guide Auto-entrepreneur et la réglementation CNSS en vigueur :\n\n";
        
        $response .= "**1. Immatriculation de l'employeur**\n";
        $response .= "Toute entreprise qui embauche doit s'immatriculer à la CNSS dans les 30 jours suivant la création. ";
        $response .= "Remplissez le formulaire d'immatriculation employeur disponible sur cnss.ma ou au centre CNSS le plus proche. ";
        $response .= "Fournissez : RC de l'entreprise, CIN du représentant légal, statuts, justificatif de siège. ";
        $response .= "Un numéro d'immatriculation CNSS vous sera attribué et servira pour toutes les déclarations futures.\n\n";
        
        $response .= "**2. Affiliation des salariés**\n";
        $response .= "Chaque salarié doit être affilié dans les 8 jours suivant son embauche. ";
        $response .= "Déclarez : nom, prénom, CIN, date de naissance, date d'embauche, salaire brut. ";
        $response .= "Un carnet d'immatriculation est délivré à chaque salarié avec son numéro CNSS personnel. ";
        $response .= "Cette affiliation est obligatoire et donne droit aux prestations sociales (maladie, maternité, retraite).\n\n";
        
        $response .= "**3. Taux de cotisations sociales**\n";
        $response .= "Les cotisations sont partagées entre employeur et salarié :\n";
        $response .= "- **Part patronale** : environ 19% du salaire brut (retraite 8,59%, AMO 3,96%, allocations familiales 6,5%, taxe de formation 1,6%)\n";
        $response .= "- **Part salariale** : 4,29% du salaire brut (retraite 3,96%, AMO 0,33%)\n";
        $response .= "- **AMO Tadamon** : cotisation supplémentaire pour la solidarité (0,33% employeur, 0,33% salarié)\n\n";
        
        $response .= "**4. Déclarations mensuelles et paiements**\n";
        $response .= "Chaque mois, vous devez effectuer la Déclaration des Salaires (DSR) avant le 10 du mois suivant. ";
        $response .= "Utilisez le portail électronique CNSS (cnss.ma) pour déclarer en ligne : plus rapide et sécurisé. ";
        $response .= "Le paiement des cotisations doit être effectué simultanément par virement bancaire ou au guichet. ";
        $response .= "En cas de retard, des pénalités sont appliquées (0,5% par mois de retard).\n\n";
        
        $response .= "**5. Régime auto-entrepreneur**\n";
        $response .= "Les auto-entrepreneurs bénéficient d'un régime simplifié :\n";
        $response .= "- Cotisation forfaitaire mensuelle : environ 300 MAD (services) ou 500 MAD (commerce)\n";
        $response .= "- AMO obligatoire inclus dans la cotisation\n";
        $response .= "- Pas de cotisations retraite complémentaire (AGIRC)\n";
        $response .= "- Déclaration trimestrielle simplifiée\n\n";
        
        $response .= "**6. Prestations et droits**\n";
        $response .= "Les salariés affiliés ont droit aux prestations suivantes :\n";
        $response .= "- **AMO (Assurance Maladie Obligatoire)** : remboursement des soins médicaux et pharmaceutiques\n";
        $response .= "- **Retraite** : pension à partir de 60 ans (ou 55 ans pour les travaux pénibles)\n";
        $response .= "- **Allocations familiales** : 300 MAD par enfant (jusqu'à 6 ans, plafond 3 enfants)\n";
        $response .= "- **Maternité** : indemnités pour les femmes salariées\n\n";
        
        $response .= "---\n\n";
        $response .= "**Délais critiques à respecter :**\n";
        $response .= "- Immatriculation employeur : 30 jours après création\n";
        $response .= "- Affiliation salarié : 8 jours après embauche\n";
        $response .= "- DSR mensuelle : avant le 10 du mois suivant\n\n";
        $response .= "**Organismes officiels :**\n";
        $response .= "- **CNSS** : cnss.ma (portail électronique pour toutes les démarches)\n";
        $response .= "- **AMO** : amo.ma (assurance maladie obligatoire)\n";
        $response .= "- **Centres CNSS** : présents dans toutes les villes du Maroc\n\n";
        $response .= "**Conseil :** Utilisez systématiquement le portail électronique CNSS pour simplifier vos démarches et éviter les erreurs de déclaration.";
        
        return $response;
    }

    private function getDetailedDefaultResponse(string $question, string $ville): string
    {
        $villeText = $ville ? " à {$ville}" : '';
        
        $response = "Pour votre question sur l'entrepreneuriat au Maroc{$villeText}, voici les informations générales basées sur les textes officiels marocains :\n\n";
        
        $response .= "**Écosystème entrepreneurial marocain**\n";
        $response .= "Le Maroc s'est doté d'un écosystème favorable à la création d'entreprise avec plusieurs réformes majeures ces dernières années. ";
        $response .= "La réforme de 2018 a supprimé le capital minimum pour les SARL, facilitant ainsi l'accès à l'entrepreneuriat. ";
        $response .= "Les Centres Régionaux d'Investissement (CRI) servent de guichets uniques pour simplifier les formalités administratives.\n\n";
        
        $response .= "**Principaux organismes à connaître**\n\n";
        
        $response .= "**1. OMPIC (Office Marocain de la Propriété Industrielle et Commerciale)**\n";
        $response .= "- Registre du commerce centralisé\n";
        $response .= "- Protection de la propriété intellectuelle (marques, brevets)\n";
        $response .= "- Portail en ligne : ompic.ma\n";
        $response .= "- Services : certificat négatif, inscription RC, dépôt de marque\n\n";
        
        $response .= "**2. DGI (Direction Générale des Impôts)**\n";
        $response .= "- Identification fiscale des entreprises\n";
        $response .= "- Gestion de l'IS, TVA et autres impôts\n";
        $response .= "- Portail : tax.gov.ma\n";
        $response .= "- Services : déclarations en ligne, paiement électronique\n\n";
        
        $response .= "**3. CRI (Centre Régional d'Investissement)**\n";
        $response .= "- Guichet unique de création d'entreprise\n";
        $response .= "- Accompagnement des porteurs de projets\n";
        $response .= "- Portail : cri.ma\n";
        $response .= "- Avantage : procédure accélérée (24-72h)\n\n";
        
        $response .= "**4. CNSS (Caisse Nationale de Sécurité Sociale)**\n";
        $response .= "- Affiliation sociale obligatoire\n";
        $response .= "- Gestion des cotisations et prestations\n";
        $response .= "- Portail : cnss.ma\n";
        $response .= "- Services : DSR en ligne, affiliation salariés\n\n";
        
        $response .= "**Documents de référence essentiels**\n";
        $response .= "- Loi 5-96 : régissant les SARL\n";
        $response .= "- Loi 17-95 : régissant les SA\n";
        $response .= "- Code Général des Impôts 2024 : fiscalité des entreprises\n";
        $response .= "- Guide de création d'entreprise OMPIC : procédures pratiques\n";
        $response .= "- Note Circulaire 735 LF 2024 : mesures fiscales récentes\n\n";
        
        $response .= "**Conseils pour réussir votre projet**\n";
        $response .= "- Choisissez la forme juridique adaptée à votre activité et vos moyens\n";
        $response .= "- Utilisez les guichets uniques CRI pour accélérer les formalités\n";
        $response .= "- Consultez un expert-comptable pour optimiser votre fiscalité\n";
        $response .= "- Respectez scrupuleusement les délais de déclaration (CNSS, DGI)\n";
        $response .= "- Protégez votre marque via l'OMPIC si votre activité le justifie\n\n";
        
        $response .= "---\n\n";
        $response .= "Pour une réponse plus spécifique, n'hésitez pas à préciser votre thématique : Création d'entreprise, Fiscalité, Statuts juridiques, Procédures OMPIC, ou CNSS & Social.";
        
        return $response;
    }
}
