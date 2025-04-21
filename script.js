let model;
let selectedImage = null;  // Pour éviter les erreurs liées à l'image non définie
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const analyzeBtn = document.getElementById('analyzeBtn');
const predictionText = document.getElementById('prediction');

// Créer une image cachée pour analyse (utilisé aussi pour la galerie)
const previewGallery = new Image();
previewGallery.crossOrigin = "anonymous"; // très important si tes images sont locales ou en ligne

// Charger le modèle Mobilenet
async function loadModel() {
  predictionText.textContent = "🧠 Je charge mes neurones... Patience ...";
  model = await mobilenet.load();
  predictionText.textContent = "Modèle chargé ✅ Envoie ton image maintenant !";
}

loadModel();

// Gérer la sélection d'un fichier (image) via input
if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block"; // Afficher l'image dès qu'elle est chargée
      selectedImage = preview;
      predictionText.textContent = "Image bien reçue. Prête à être reconnue 🔥";
    };
    reader.readAsDataURL(file);
  });
}

// Gérer le clic pour analyser l'image
if (analyzeBtn) {
  analyzeBtn.addEventListener('click', async () => {
    if (!model || !selectedImage || !selectedImage.src) {
      predictionText.textContent = "Tu veux que je devine quoi ? Charge une image 😅";
      return;
    }

    predictionText.textContent = "Hmm... Je réfléchis très fort 🤔";

    const predictions = await model.classify(selectedImage);
    if (predictions.length > 0) {
      // Prendre seulement la première prédiction (la plus probable)
      const topPrediction = predictions[0];

      const resultHTML = `
        <div class="prediction-card">
          <h3>Prédiction :</h3>
          <p class="class-name">${topPrediction.className}</p>
          <p class="confidence">Confiance : ${(topPrediction.probability * 100).toFixed(1)}%</p>
          <p class="comment">${getFunnyComment(topPrediction.className)}</p>
        </div>
      `;
      
      predictionText.innerHTML = resultHTML;
    } else {
      predictionText.textContent = "J’ai rien trouvé ... désolé 😅";
    }
  });
}

// Fonction de commentaires drôles
function getFunnyComment(label) {
  const jokes = [
  "Trop facile celui-là 😎",
  "J'espère que c’est bien ça sinon j’ai honte 👀",
  "On dirait bien… mais j’ai vu flou 👀",
  "Ma prédiction est aussi solide qu’un café ☕️",
  "L’IA a parlé. Mais t’as le droit de ne pas être d’accord 😅",
  "C’est ma meilleure supposition ... ou pas 😂",
  "J’ai analysé ça plus vite que mon ombre 🤠",
  "J’ai demandé à mes circuits, et voilà la réponse 🤖",
  "95% de confiance. Bon, peut-être 60% 😬",
  "Même moi j’en reviens pas 😲",
  "Je parie mon processeur que j’ai raison ! 🧠",
  "Pas sûr à 200%, mais ça a l’air bon 😁",
  "Ma boule de cristal m’a soufflé ça 🔮",
  "Un peu flou, mais ça ressemble à ça 👓",
  "Tant que c’est pas de l'air, tout va bien 🍝"
  ];
  return jokes[Math.floor(Math.random() * jokes.length)];
}

// Partie galerie : analyser une image au clic
document.addEventListener("DOMContentLoaded", () => {
  const galleryImages = document.querySelectorAll(".gallery-img");

  galleryImages.forEach(img => {
    img.addEventListener("click", () => {
      console.log("Image cliquée :", img.src); // 🔍 debug

      // Attendre que l'image soit bien chargée avant de lancer l'analyse
      previewGallery.onload = () => {
        console.log("Image chargée, lancement de l'analyse");
        predictFromImage(previewGallery);
      };
      previewGallery.src = img.src; // Charger l'image dans l'objet `previewGallery`
    });
  });
});

// Prédiction à partir d'une image
async function predictFromImage(imgElement) {
  try {
    if (!model) {
      predictionText.textContent = "⏳ Modèle non prêt...";
      return;
    }

    predictionText.textContent = "🔍 Analyse en cours...";

    const predictions = await model.classify(imgElement);
    console.log("Prédictions :", predictions); // 🔍 debug

    if (predictions.length > 0) {
      const top = predictions[0];
      predictionText.innerHTML = `
        <div class="mt-3">
          <h4>🔮 ${top.className}</h4>
          <p>Confiance : ${(top.probability * 100).toFixed(1)}%</p>
          <p>${getFunnyComment(top.className)}</p>
        </div>
      `;
    } else {
      predictionText.textContent = "❌ Je n’ai rien trouvé… essaie une autre image 😅";
    }
  } catch (err) {
    console.error("Erreur pendant l'analyse :", err);
    predictionText.textContent = "❌ Une erreur s’est produite pendant l’analyse.";
  }
}

