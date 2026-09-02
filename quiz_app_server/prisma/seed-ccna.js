const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CCNA_QUIZZES = [
  {
    title: 'CCNA 1 — ITNv7 (Notions de base sur les réseaux)',
    description: 'Examen final CCNA 1 ITNv7 — adressage IP, protocoles, sécurité et modèles OSI/TCP-IP.',
    questions: [
      {
        question: 'Quels sont les trois éléments de configuration supplémentaires nécessaires pour configurer SSH sur un routeur R1 ?',
        options: [
          { text: 'Activez les sessions SSH et configurez le nom de domaine IP', isCorrect: false },
          { text: 'Générez les clés SSH et activez les sessions SSH entrantes sur VTY', isCorrect: true },
          { text: 'Configurez DNS et générez des clés bidirectionnelles', isCorrect: false },
          { text: 'Activez Telnet et configurez la passerelle par défaut', isCorrect: false },
        ],
      },
      {
        question: "Qu'est-ce qu'un protocole propriétaire ?",
        options: [
          { text: 'Un protocole librement utilisable par toute entreprise', isCorrect: false },
          { text: "Un protocole dont la définition est contrôlée par une entreprise spécifique", isCorrect: true },
          { text: 'Un ensemble de protocoles TCP/IP standardisés', isCorrect: false },
          { text: 'Un protocole développé pour fonctionner avec du matériel universel', isCorrect: false },
        ],
      },
      {
        question: 'Quel est le plus petit masque réseau pour un réseau devant supporter 4 périphériques ?',
        options: [
          { text: '255.255.255.224', isCorrect: false },
          { text: '255.255.255.248', isCorrect: true },
          { text: '255.255.255.192', isCorrect: false },
          { text: '255.255.255.128', isCorrect: false },
        ],
      },
      {
        question: 'À quoi sert le glissement de fenêtre TCP ?',
        options: [
          { text: 'Mettre fin à une communication complète', isCorrect: false },
          { text: "Demander à une source de réduire la vitesse de transmission", isCorrect: true },
          { text: 'Demander la retransmission des données', isCorrect: false },
          { text: "Assurer l'ordre des segments", isCorrect: false },
        ],
      },
      {
        question: 'Quel port de destination indique une demande TFTP ?',
        options: [
          { text: '53', isCorrect: false },
          { text: '67', isCorrect: false },
          { text: '69', isCorrect: true },
          { text: '80', isCorrect: false },
        ],
      },
      {
        question: 'Quelle caractéristique décrit un cheval de Troie ?',
        options: [
          { text: 'Logiciel malveillant caché dans du code légitime', isCorrect: true },
          { text: "Utilisation d'identifiants volés", isCorrect: false },
          { text: 'Attaque ralentissant un service réseau', isCorrect: false },
          { text: 'Filtrage du trafic réseau', isCorrect: false },
        ],
      },
      {
        question: "Quelle commande Windows affiche la configuration IP d'un ordinateur ?",
        options: [
          { text: 'ping', isCorrect: false },
          { text: 'ipconfig', isCorrect: true },
          { text: 'show ip interface brief', isCorrect: false },
          { text: 'show interfaces', isCorrect: false },
        ],
      },
      {
        question: "Quel mécanisme empêche un paquet IPv4 de voyager indéfiniment sur un réseau ?",
        options: [
          { text: 'Vérification du champ TTL et rejet si égal à 0', isCorrect: false },
          { text: 'Décrémentation du TTL et rejet si égal à 0', isCorrect: true },
          { text: "Incrémentation du TTL jusqu'à 100", isCorrect: false },
          { text: 'Vérification de la somme de contrôle', isCorrect: false },
        ],
      },
      {
        question: "Quel service HTTPS fournit-il essentiellement ?",
        options: [
          { text: "Traduction de noms de domaine en adresses IP", isCorrect: false },
          { text: 'Accès distant aux périphériques réseau', isCorrect: false },
          { text: "Sécurisation cryptée de l'échange web", isCorrect: true },
          { text: "Attribution dynamique d'adresses IP", isCorrect: false },
        ],
      },
      {
        question: "Quel masque de sous-réseau convient pour 40 hôtes sans gaspillage d'adresses ?",
        options: [
          { text: '255.255.255.128', isCorrect: false },
          { text: '255.255.255.192', isCorrect: true },
          { text: '255.255.255.224', isCorrect: false },
          { text: '255.255.255.240', isCorrect: false },
        ],
      },
      {
        question: 'À quel port de destination correspond le service SSH ?',
        options: [
          { text: '20', isCorrect: false },
          { text: '21', isCorrect: false },
          { text: '22', isCorrect: true },
          { text: '23', isCorrect: false },
        ],
      },
      {
        question: 'Quel protocole utilise la méthode CSMA/CA pour la gestion des conflits ?',
        options: [
          { text: 'Ethernet filaire', isCorrect: false },
          { text: 'Réseaux sans fil', isCorrect: true },
          { text: 'Token Ring', isCorrect: false },
          { text: 'Frame Relay', isCorrect: false },
        ],
      },
      {
        question: 'Quel est le plus petit masque réseau pour 200 périphériques ?',
        options: [
          { text: '255.255.255.0', isCorrect: false },
          { text: '255.255.255.128', isCorrect: true },
          { text: '255.255.255.192', isCorrect: false },
          { text: '255.255.255.224', isCorrect: false },
        ],
      },
      {
        question: 'À quel port de destination correspond le service DNS ?',
        options: [
          { text: '80', isCorrect: false },
          { text: '53', isCorrect: true },
          { text: '443', isCorrect: false },
          { text: '25', isCorrect: false },
        ],
      },
      {
        question: 'Quel service DHCP fournit-il principalement ?',
        options: [
          { text: 'Transfert sécurisé de fichiers', isCorrect: false },
          { text: "Attribution dynamique d'adresses IP", isCorrect: true },
          { text: 'Résolution de noms de domaine', isCorrect: false },
          { text: 'Accès distant crypté', isCorrect: false },
        ],
      },
    ],
  },
  {
    title: 'CCNA 2 — SRWEv7 (Commutation, routage et sans fil)',
    description: 'Examen final CCNA 2 SRWEv7 — VLANs, STP, EtherChannel, routage inter-VLAN et sécurité réseau.',
    questions: [
      {
        question: 'Dans quelle situation utilise-t-on la commande show interfaces sur un commutateur ?',
        options: [
          { text: "Pour déterminer l'adresse MAC d'un périphérique directement connecté sur une interface donnée", isCorrect: true },
          { text: "Quand des paquets sont reçus d'un hôte directement connecté", isCorrect: false },
          { text: "Quand un terminal peut atteindre les périphériques locaux, mais pas distants", isCorrect: false },
          { text: "Pour déterminer si l'accès distant est activé", isCorrect: false },
        ],
      },
      {
        question: "Quelles sont les trois étapes requises pour configurer le routage inter-VLAN sur un commutateur de couche 3 ?",
        options: [
          { text: "Créer les VLANs, créer les interfaces SVI, activer le routage IP", isCorrect: true },
          { text: "Assigner les ports au VLAN natif, implémenter des protocoles de routage, créer les interfaces SVI", isCorrect: false },
          { text: "Activer le routage IP, modifier le VLAN par défaut, installer une route statique", isCorrect: false },
          { text: "Assigner les ports au VLAN d'accès, configurer les protocoles de routage, créer les interfaces SVI", isCorrect: false },
        ],
      },
      {
        question: "Pourquoi le VLAN 99 est-il absent de la configuration de l'interface de gestion ?",
        options: [
          { text: 'Il y a un problème de câblage sur le VLAN 99', isCorrect: false },
          { text: "Le VLAN 99 n'a pas encore été créé", isCorrect: true },
          { text: 'Le VLAN 1 est activé et un seul VLAN de gestion peut exister', isCorrect: false },
          { text: "Le VLAN 99 n'est pas un VLAN de gestion valide", isCorrect: false },
        ],
      },
      {
        question: 'Quelles paires de modes EtherChannel établissent un lien agrégé fonctionnel entre des commutateurs Cisco ?',
        options: [
          { text: 'dynamic auto avec dynamic auto, dynamic desirable avec dynamic desirable, dynamic desirable avec trunk', isCorrect: true },
          { text: 'access avec trunk, dynamic desirable avec dynamic auto, dynamic auto avec dynamic auto', isCorrect: false },
          { text: 'dynamic desirable avec trunk, dynamic desirable avec dynamic auto, access avec dynamic auto', isCorrect: false },
          { text: 'Toutes les combinaisons ci-dessus', isCorrect: false },
        ],
      },
      {
        question: 'Quel protocole ou technologie nécessite que les commutateurs soient en mode serveur ou client ?',
        options: [
          { text: 'HSRP', isCorrect: false },
          { text: 'VTP', isCorrect: true },
          { text: 'EtherChannel', isCorrect: false },
          { text: 'DTP', isCorrect: false },
        ],
      },
      {
        question: "Quelle est la méthode de chiffrement sans fil la plus sécurisée ?",
        options: [
          { text: 'WPA2 avec AES', isCorrect: true },
          { text: 'WPA2 avec TKIP', isCorrect: false },
          { text: 'WEP', isCorrect: false },
          { text: 'WPA', isCorrect: false },
        ],
      },
      {
        question: "Quels deux modes VTP permettent la création, la modification et la suppression de VLANs sur le commutateur local ?",
        options: [
          { text: 'Client et distribution', isCorrect: false },
          { text: 'Serveur et transparent', isCorrect: true },
          { text: 'Primaire et client', isCorrect: false },
          { text: 'Esclave et primaire', isCorrect: false },
        ],
      },
      {
        question: "Lorsqu'une trame entre dans un commutateur avec une adresse MAC source inconnue, quelle action se produit ?",
        options: [
          { text: 'Le commutateur rejette la trame', isCorrect: false },
          { text: "Le commutateur ajoute l'adresse MAC et le port entrant à la table des adresses MAC", isCorrect: true },
          { text: 'Le commutateur inonde la trame sur tous les ports sauf le port entrant', isCorrect: false },
          { text: 'Le commutateur transmet directement la trame à la destination', isCorrect: false },
        ],
      },
      {
        question: "Quelle est la meilleure méthode pour sécuriser l'accès distant aux périphériques réseau ?",
        options: [
          { text: 'Configurer SSH', isCorrect: true },
          { text: 'Configurer Telnet', isCorrect: false },
          { text: 'Configurer une ACL sur le VLAN 1', isCorrect: false },
          { text: "Configurer l'authentification 802.1x", isCorrect: false },
        ],
      },
      {
        question: "Quel est l'effet de la commande ip route 0.0.0.0 0.0.0.0 serial 0/1/1 sur le routeur HQ ?",
        options: [
          { text: "Les paquets destinés à des réseaux absents de la table de routage sont transmis vers Internet", isCorrect: true },
          { text: 'Les paquets provenant Internet sont transmis aux LAN internes', isCorrect: false },
          { text: 'Les paquets vers des réseaux inconnus sont rejetés', isCorrect: false },
          { text: 'Les paquets entre 10.10.0.0 et 10.20.0.0 sont échangés', isCorrect: false },
        ],
      },
      {
        question: "Quelle adresse MAC de destination est utilisée lorsque les trames sont envoyées depuis un poste de travail vers la passerelle par défaut en HSRP ?",
        options: [
          { text: 'Adresses MAC des routeurs actif et en veille', isCorrect: false },
          { text: 'Adresse MAC du routeur actif uniquement', isCorrect: false },
          { text: 'Adresse MAC du routeur en veille uniquement', isCorrect: false },
          { text: 'Adresse MAC du routeur virtuel', isCorrect: true },
        ],
      },
      {
        question: "Quel est le résultat lorsque STP traite deux commutateurs connectés via EtherChannel ?",
        options: [
          { text: 'Les deux EtherChannels équilibrent la charge et transmettent les paquets', isCorrect: false },
          { text: 'Une tempête de diffusion est créée par la boucle', isCorrect: false },
          { text: 'STP bloque un des liens redondants', isCorrect: true },
          { text: 'Les deux canaux de ports sont fermés', isCorrect: false },
        ],
      },
      {
        question: "Quels trois standards opèrent dans la plage de fréquences 2,4 GHz ?",
        options: [
          { text: '802.11b, 802.11a, 802.11ac', isCorrect: false },
          { text: '802.11b, 802.11n, 802.11g', isCorrect: true },
          { text: '802.11a, 802.11ac, 802.11n', isCorrect: false },
          { text: '802.11n, 802.11ac, 802.11g', isCorrect: false },
        ],
      },
      {
        question: "Quel est l'effet de la commande shutdown sur un port de commutateur ?",
        options: [
          { text: 'Elle active PortFast sur une interface spécifique', isCorrect: false },
          { text: 'Elle désactive un port inutilisé', isCorrect: true },
          { text: 'Elle désactive DTP sur une interface non-trunk', isCorrect: false },
          { text: 'Elle active BPDU Guard sur un port spécifique', isCorrect: false },
        ],
      },
      {
        question: "Quelle configuration IPv6 de routage statique sur R1 est incorrecte ?",
        options: [
          { text: "L'adresse du saut suivant est incorrecte", isCorrect: false },
          { text: 'Le réseau de destination est incorrect', isCorrect: false },
          { text: "L'interface est incorrecte", isCorrect: true },
          { text: 'Le préfixe réseau est incorrect', isCorrect: false },
        ],
      },
    ],
  },
  {
    title: 'CCNA 3 — ENSAv7 (Technologies réseau d\'entreprise)',
    description: "Examen final CCNA 3 ENSAv7 — OSPF, QoS, VPN, virtualisation, cloud et automatisation réseau.",
    questions: [
      {
        question: "Un administrateur réseau a modifié un routeur compatible OSPF pour avoir un paramètre de minuterie Hello de 20 secondes. Quel est le nouveau paramètre d'intervalle Dead par défaut ?",
        options: [
          { text: '40 secondes', isCorrect: false },
          { text: '60 secondes', isCorrect: false },
          { text: '80 secondes', isCorrect: true },
          { text: '100 secondes', isCorrect: false },
        ],
      },
      {
        question: "Quelle table OSPF est identique sur tous les routeurs convergents dans la même zone OSPF ?",
        options: [
          { text: 'neighbor', isCorrect: false },
          { text: 'contiguïté', isCorrect: false },
          { text: 'routage', isCorrect: false },
          { text: 'topologie', isCorrect: true },
        ],
      },
      {
        question: "Quelle est la fonction principale d'un hyperviseur ?",
        options: [
          { text: "Créer et gérer plusieurs instances de machine virtuelle", isCorrect: true },
          { text: "Filtrer et vérifier les informations d'identification", isCorrect: false },
          { text: 'Contrôler les ressources informatiques du cloud', isCorrect: false },
          { text: 'Synchroniser un groupe de capteurs', isCorrect: false },
        ],
      },
      {
        question: "En quoi la virtualisation est-elle utile à la reprise après sinistre ?",
        options: [
          { text: 'Le provisionnement des serveurs est plus rapide', isCorrect: false },
          { text: "Tous les équipements n'ont pas besoin d'être identiques", isCorrect: true },
          { text: "Moins d'énergie est consommée", isCorrect: false },
          { text: "Il y a toujours du courant", isCorrect: false },
        ],
      },
      {
        question: "Qu'est-ce qu'un WAN ?",
        options: [
          { text: 'Infrastructure pour stockage et réplication de données', isCorrect: false },
          { text: "Infrastructure fournissant accès à d'autres réseaux dans un vaste périmètre", isCorrect: true },
          { text: "Infrastructure s'étendant sur un périmètre limité comme une ville", isCorrect: false },
          { text: "Infrastructure fournissant accès dans un petit périmètre", isCorrect: false },
        ],
      },
      {
        question: "Quel type de paquet OSPF est utilisé pour découvrir les routeurs voisins ?",
        options: [
          { text: 'Description de base de données (DD)', isCorrect: false },
          { text: 'Hello', isCorrect: true },
          { text: "Mises à jour d'état de lien (LSU)", isCorrect: false },
          { text: 'Link-State Request (LSR)', isCorrect: false },
        ],
      },
      {
        question: "Quels sont trois avantages du cloud computing ?",
        options: [
          { text: "Utilise logiciels open source pour traitement distribué", isCorrect: false },
          { text: "Élimine le besoin d'équipements IT sur site", isCorrect: true },
          { text: "Permet accès aux données partout et à tout moment", isCorrect: false },
          { text: "Transforme données brutes en informations utiles", isCorrect: false },
        ],
      },
      {
        question: "Pourquoi la QoS est-elle importante dans un réseau convergé ?",
        options: [
          { text: 'Communications de données sensibles à la gigue', isCorrect: false },
          { text: 'Communications vocales et vidéo plus sensibles à la latence', isCorrect: true },
          { text: 'Communications de données doivent être prioritaires', isCorrect: false },
          { text: "Appareils anciens ne peuvent pas transmettre voix et vidéo", isCorrect: false },
        ],
      },
      {
        question: "Quel type de VPN utilise une configuration hub-and-spoke pour établir une topologie maillée ?",
        options: [
          { text: 'VPN MPLS', isCorrect: false },
          { text: 'GRE sur IPsec', isCorrect: false },
          { text: 'Interface de tunnel virtuel IPSec', isCorrect: false },
          { text: 'VPN multipoint dynamique (DMVPN)', isCorrect: true },
        ],
      },
      {
        question: "Quelle fonctionnalité permet de limiter la taille d'un domaine défaillant ?",
        options: [
          { text: "Achat d'équipement d'entreprise conçu pour volume important", isCorrect: false },
          { text: "Utilisation de la méthode du bloc de commutation du bâtiment", isCorrect: true },
          { text: "Utilisation d'une conception réseau principale regroupée", isCorrect: false },
          { text: "Installation d'alimentations redondantes", isCorrect: false },
        ],
      },
      {
        question: "Quel format de données est utilisé pour les applications d'automatisation réseau ?",
        options: [
          { text: 'HTML', isCorrect: false },
          { text: 'YAML', isCorrect: false },
          { text: 'JSON', isCorrect: true },
          { text: 'XML', isCorrect: false },
        ],
      },
      {
        question: "Quel protocole synchronise avec une horloge maître privée ou un serveur public ?",
        options: [
          { text: 'MPLS', isCorrect: false },
          { text: 'TFTP', isCorrect: false },
          { text: 'NTP', isCorrect: true },
          { text: 'CBWFQ', isCorrect: false },
        ],
      },
      {
        question: "Quel type de réseau utilise une infrastructure commune pour le trafic voix, données et vidéo ?",
        options: [
          { text: 'Convergé', isCorrect: true },
          { text: 'Sans frontières', isCorrect: false },
          { text: 'Administré', isCorrect: false },
          { text: 'Commuté', isCorrect: false },
        ],
      },
      {
        question: "Quel protocole offre des services d'authentification et est un type de VPN ?",
        options: [
          { text: 'IPsec', isCorrect: true },
          { text: 'ESP', isCorrect: false },
          { text: 'AES', isCorrect: false },
          { text: 'MD5', isCorrect: false },
        ],
      },
      {
        question: "Quel type de trafic tolère la latence, la gigue et la perte sans effets perceptibles ?",
        options: [
          { text: 'Voix', isCorrect: false },
          { text: 'Données', isCorrect: true },
          { text: 'Vidéo', isCorrect: false },
          { text: 'Multimédia', isCorrect: false },
        ],
      },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding CCNA quizzes...');

  const admin = await prisma.user.findUnique({ where: { email: 'admin@quiz.com' } });
  if (!admin) {
    throw new Error('Admin user not found. Run seed.js first.');
  }

  for (const quizData of CCNA_QUIZZES) {
    const existing = await prisma.quiz.findFirst({ where: { title: quizData.title } });
    if (existing) {
      console.log(`⏭️  Quiz already exists: ${quizData.title}`);
      continue;
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: quizData.title,
        description: quizData.description,
        isActive: true,
        createdById: admin.id,
      },
    });
    console.log(`✅ Quiz created: ${quiz.title} (id=${quiz.id})`);

    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      const question = await prisma.question.create({
        data: {
          quizId: quiz.id,
          question: q.question,
          type: 'MULTIPLE_CHOICE',
          points: 1,
          order: i + 1,
        },
      });

      for (let j = 0; j < q.options.length; j++) {
        await prisma.option.create({
          data: {
            questionId: question.id,
            text: q.options[j].text,
            isCorrect: q.options[j].isCorrect,
            order: j + 1,
          },
        });
      }
      console.log(`   ✅ Q${i + 1}: ${q.question.substring(0, 60)}...`);
    }
  }

  console.log('\n🎉 CCNA seeding completed! 3 quizzes × 15 questions = 45 questions total.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
