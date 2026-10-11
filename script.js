
document.addEventListener("DOMContentLoaded", () => {
  // Change this if your business WhatsApp number is different.
  const WHATSAPP_NUMBER = "919502750677";

  // MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
      });
    });
  }

  // AUTOMATIC COPYRIGHT YEAR
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // COLOUR SUGGESTIONS
  const colourDetails = {
    pink: {
      name: "Pink",
      pairing: "antique gold and ivory",
      thread: "antique gold with soft ivory highlights"
    },
    maroon: {
      name: "Maroon",
      pairing: "antique gold and muted blush",
      thread: "antique gold with rose highlights"
    },
    green: {
      name: "Green",
      pairing: "antique gold and champagne",
      thread: "gold with cream highlights"
    },
    blue: {
      name: "Blue",
      pairing: "silver and pearl white",
      thread: "silver with pearl-white accents"
    },
    black: {
      name: "Black",
      pairing: "antique gold and champagne",
      thread: "gold with subtle champagne highlights"
    },
    cream: {
      name: "Cream",
      pairing: "rose gold and dusty pink",
      thread: "rose gold with dusty-pink accents"
    },
    purple: {
      name: "Purple",
      pairing: "silver and soft lilac",
      thread: "silver with lilac highlights"
    },
    yellow: {
      name: "Yellow",
      pairing: "deep green and antique gold",
      thread: "antique gold with deep-green accents"
    }
  };

  const patterns = {
    floral: "a delicate floral vine with small leaves and tiny scattered buds",
    traditional: "traditional paisley motifs with ornamental borders",
    minimal: "a clean, minimal pattern with fine outlines and carefully spaced accents",
    grand: "an elaborate motif arrangement with layered borders and detailed threadwork"
  };

  const garmentIdeas = {
    blouse: "Place the main motif on the sleeves and back, with a coordinated neckline border.",
    saree: "Use a coordinated border and smaller repeated motifs, keeping the pallu as the focal point.",
    dress: "Keep the main embroidery near the neckline or waist, with smaller motifs for balance.",
    "bridal outfit": "Create a statement motif with coordinated borders and detailed accents for a celebratory look."
  };

  const occasionNotes = {
    "everyday wear": "Keep the embroidery lightweight and comfortable for regular use.",
    "festive occasion": "Add a little shimmer for a festive look without overcrowding the design.",
    wedding: "Use richer threadwork and a coordinated border for a celebratory finish.",
    engagement: "Choose refined motifs with a balanced mix of shine and delicate detail.",
    party: "Try a bold focal motif with a neat, elegant finish."
  };

  const styleTitles = {
    floral: "Soft Floral Elegance",
    traditional: "Classic Heritage Motifs",
    minimal: "Modern Minimal Grace",
    grand: "Statement Embroidery"
  };

  let latestIdea = "";

  // DESIGN IDEA STUDIO
  const aiForm = document.getElementById("aiForm");
  const aiResult = document.getElementById("aiResult");
  const useIdeaButton = document.getElementById("useIdea");

  if (aiForm && aiResult && useIdeaButton) {
    aiForm.addEventListener("submit", event => {
      event.preventDefault();

      const garment = document.getElementById("garment").value;
      const occasion = document.getElementById("occasion").value;
      const colour = document.getElementById("baseColour").value;
      const style = document.getElementById("workStyle").value;
      const combo = colourDetails[colour];

      if (!combo || !patterns[style] || !garmentIdeas[garment] || !occasionNotes[occasion]) {
        aiResult.textContent = "Please select valid design options and try again.";
        aiResult.hidden = false;
        return;
      }

      latestIdea = [
        `Garment: ${garment}`,
        `Occasion: ${occasion}`,
        `Outfit colour: ${combo.name}`,
        `Colour combination: ${combo.pairing}`,
        `Pattern: ${patterns[style]}`,
        `Placement: ${garmentIdeas[garment]}`,
        `Thread suggestion: ${combo.thread}`,
        `Occasion tip: ${occasionNotes[occasion]}`
      ].join("\n");

      // Build the result safely without inserting HTML from user input.
      aiResult.replaceChildren();

      const title = document.createElement("h4");
      title.textContent = styleTitles[style];

      const details = [
        ["Colour palette", `${combo.name} with ${combo.pairing}.`],
        ["Pattern", `${patterns[style]}.`],
        ["Placement", garmentIdeas[garment]],
        ["Thread suggestion", `${combo.thread}.`],
        ["Occasion tip", occasionNotes[occasion]]
      ];

      aiResult.appendChild(title);

      details.forEach(([label, value]) => {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = `${label}: `;
        paragraph.append(strong, document.createTextNode(value));
        aiResult.appendChild(paragraph);
      });

      aiResult.hidden = false;
      useIdeaButton.hidden = false;
    });

    // TRANSFER THE DESIGN IDEA TO THE ORDER FORM
    useIdeaButton.addEventListener("click", () => {
      const garment = document.getElementById("garment").value;
      const occasion = document.getElementById("occasion").value;

      const typeMap = {
        blouse: "Blouse",
        saree: "Saree",
        dress: "Dress",
        "bridal outfit": "Bridal outfit"
      };

      const occasionMap = {
        "everyday wear": "Everyday",
        "festive occasion": "Festive",
        wedding: "Wedding",
        engagement: "Engagement",
        party: "Party"
      };

      document.getElementById("orderType").value = typeMap[garment] || "";
      document.getElementById("orderColour").value =
        colourDetails[document.getElementById("baseColour").value].name;
      document.getElementById("orderOccasion").value =
        occasionMap[occasion] || "Other";
      document.getElementById("orderDescription").value = latestIdea;

      document.getElementById("order").scrollIntoView({ behavior: "smooth" });
    });
  }

  // CLICK A GALLERY CARD TO PRESELECT THE ORDER TYPE
  const orderType = document.getElementById("orderType");

  document.querySelectorAll("[data-design], [data-order]").forEach(item => {
    item.addEventListener("click", () => {
      if (!orderType) return;

      const requestedType = item.dataset.order || item.dataset.design;
      const allowedTypes = [
        "Blouse",
        "Saree",
        "Dress",
        "Bridal outfit",
        "Other custom work"
      ];

      if (allowedTypes.includes(requestedType)) {
        orderType.value = requestedType;
      }
    });
  });

  // WHATSAPP CUSTOM ORDER FORM
  const orderForm = document.getElementById("orderForm");

  if (orderForm) {
    orderForm.addEventListener("submit", event => {
      event.preventDefault();

      const name = document.getElementById("customerName").value.trim();
      const phone = document.getElementById("customerPhone").value.trim();
      const type = document.getElementById("orderType").value;
      const colour = document.getElementById("orderColour").value.trim() || "Not specified";
      const occasion = document.getElementById("orderOccasion").value;
      const description = document.getElementById("orderDescription").value.trim();

      if (!name || !type || !description) {
        alert("Please fill in your name, garment type and design description.");
        return;
      }

      const message = [
        "Hello Lotus Creations! 🌸",
        "",
        "I would like to enquire about a custom embroidery order.",
        `Name: ${name}`,
        `Phone: ${phone || "Not provided"}`,
        `Garment: ${type}`,
        `Outfit colour: ${colour}`,
        `Occasion: ${occasion}`,
        `Design details: ${description}`,
        "",
        "Please let me know the price and estimated completion time. Thank you!"
      ].join("\n");

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      const newWindow = window.open(whatsappURL, "_blank");

      if (newWindow) {
        newWindow.opener = null;
      } else {
        // Fallback if the browser blocks the new tab.
        window.location.href = whatsappURL;
      }
    });
  }

  // FLOATING LOTUS FLOWERS
  function createLotusAnimation() {
    const layer = document.getElementById("lotusBackground");
    if (!layer || layer.dataset.initialized === "true") return;

    layer.dataset.initialized = "true";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const symbols = ["✿", "❀", "✾", "❋", "✽"];
    const colours = ["#e8a3bd", "#d8b7ef", "#f3c5a0", "#df8eab", "#c7a7e8"];
    const totalPetals = window.innerWidth < 600 ? 10 : 20;

    for (let i = 0; i < totalPetals; i++) {
      const petal = document.createElement("span");

      petal.className = "lotus-petal";
      petal.setAttribute("aria-hidden", "true");
      petal.textContent = symbols[i % symbols.length];

      petal.style.setProperty("--x", `${Math.random() * 100}%`);
      petal.style.setProperty("--size", `${16 + Math.random() * 22}px`);
      petal.style.setProperty("--duration", `${15 + Math.random() * 18}s`);
      petal.style.setProperty("--delay", `${-Math.random() * 30}s`);
      petal.style.setProperty("--petal-colour", colours[i % colours.length]);

      layer.appendChild(petal);
    }
  }

  createLotusAnimation();
});
