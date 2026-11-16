const API_URL = "/desenho";

const memeForm = document.querySelector("#meme-form");
const searchForm = document.querySelector("#search-form");
const editForm = document.querySelector("#edit-form");
const tableBody = document.querySelector("#meme-table-body");
const emptyState = document.querySelector("#empty-state");
const resultsLabel = document.querySelector("#results-label");
const statusMessage = document.querySelector("#status-message");
const editDialog = document.querySelector("#edit-dialog");

let currentSearch = "";

function setStatus(message = "", type = "info") {
    statusMessage.textContent = message;
    statusMessage.className = `status-message status-${type}`;
    statusMessage.hidden = !message;
}

function setFormLoading(form, loading, label) {
    const button = form.querySelector('button[type="submit"]');
    if (!button) return;

    if (loading) {
        button.dataset.originalLabel = button.textContent.trim();
        button.disabled = true;
        button.textContent = label;
    } else {
        button.disabled = false;
        if (button.dataset.originalLabel) {
            button.textContent = button.dataset.originalLabel;
            delete button.dataset.originalLabel;
        }
    }
}

async function request(path, options = {}) {
    const response = await fetch(path, options);
    const body = await response.text();

    if (!response.ok) {
        let detail = "";
        try {
            const errorBody = JSON.parse(body);
            detail = errorBody.message || errorBody.error || errorBody.detail || "";
        } catch {
            detail = body.trim();
        }
        throw new Error(detail || `A API respondeu com erro (${response.status}).`);
    }

    return body ? JSON.parse(body) : null;
}

function jsonOptions(method, body) {
    return {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
}

function nameQuery(name) {
    return new URLSearchParams({ nome: name }).toString();
}

function setHttpUrlValidation(input) {
    input.setCustomValidity("");
    if (!input.value.trim()) return;

    if (input.value.trim().length > 255) {
        input.setCustomValidity("A URL deve ter no máximo 255 caracteres, conforme o limite do backend.");
        return;
    }

    try {
        const url = new URL(input.value.trim());
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            input.setCustomValidity("Informe uma URL iniciada por http:// ou https://.");
        }
    } catch {
        input.setCustomValidity("Informe uma URL válida iniciada por http:// ou https://.");
    }
}

function setRequiredTextValidation(input) {
    input.setCustomValidity(input.value.trim() ? "" : "Este campo é obrigatório.");
}

function addCell(row, text, className = "") {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.textContent = text ?? "";
    row.append(cell);
    return cell;
}

function safeImageUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
    } catch {
        return null;
    }
}

function createMemeRow(meme) {
    const row = document.createElement("tr");
    addCell(row, meme.id);

    const imageCell = document.createElement("td");
    const imageUrl = safeImageUrl(meme.urlImagem);
    if (imageUrl) {
        const image = document.createElement("img");
        image.className = "table-image";
        image.src = imageUrl;
        image.alt = `Meme: ${meme.nome || ""}`;
        image.loading = "lazy";
        image.addEventListener("error", () => {
            image.remove();
            const unavailable = document.createElement("span");
            unavailable.className = "image-unavailable";
            unavailable.textContent = "Indisponível";
            imageCell.append(unavailable);
        }, { once: true });
        imageCell.append(image);
    } else {
        const unavailable = document.createElement("span");
        unavailable.className = "image-unavailable";
        unavailable.textContent = "Indisponível";
        imageCell.append(unavailable);
    }
    row.append(imageCell);

    addCell(row, meme.nome, "name-cell");
    addCell(row, meme.email, "email-cell");
    addCell(row, meme.descricao, "description-cell");

    const actions = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "row-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "button button-secondary";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => openEditDialog(meme));
    actionGroup.append(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "button button-delete";
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", () => deleteMeme(meme, deleteButton));
    actionGroup.append(deleteButton);

    actions.append(actionGroup);
    row.append(actions);
    return row;
}

function renderMemes(memes) {
    tableBody.replaceChildren();
    memes.forEach((meme) => tableBody.append(createMemeRow(meme)));
    emptyState.hidden = memes.length !== 0;
    resultsLabel.textContent = `${memes.length} ${memes.length === 1 ? "meme" : "memes"}`;
}

async function loadMemes({ preserveStatus = false } = {}) {
    if (!preserveStatus) setStatus("Carregando lista...", "loading");
    try {
        const memes = await request(API_URL);
        if (!Array.isArray(memes)) throw new Error("A API não retornou uma lista válida.");
        currentSearch = "";
        renderMemes(memes);
        if (!preserveStatus) setStatus("Lista atualizada.", "success");
        return memes;
    } catch (error) {
        if (!preserveStatus) setStatus(error.message || "Não foi possível carregar a lista.", "error");
        throw error;
    }
}

async function searchMemes(name) {
    currentSearch = name;
    setStatus("Buscando memes...", "loading");
    try {
        const memes = await request(`${API_URL}?${nameQuery(name)}`);
        if (!Array.isArray(memes)) throw new Error("A API não retornou uma lista válida.");
        renderMemes(memes);
        setStatus("Pesquisa concluída.", "success");
        return memes;
    } catch (error) {
        setStatus(error.message || "Não foi possível pesquisar.", "error");
        throw error;
    }
}

async function refreshCurrentList() {
    if (!currentSearch) {
        await loadMemes({ preserveStatus: true });
        return;
    }

    const memes = await request(`${API_URL}?${nameQuery(currentSearch)}`);
    if (!Array.isArray(memes)) throw new Error("A API não retornou uma lista válida.");
    renderMemes(memes);
}

function openEditDialog(meme) {
    editForm.elements.id.value = meme.id;
    editForm.elements.nome.value = meme.nome || "";
    editForm.elements.descricao.value = meme.descricao || "";
    editForm.elements.urlImagem.value = meme.urlImagem || "";
    editDialog.showModal();
}

async function deleteMeme(meme, button) {
    const confirmed = window.confirm(
        `Excluir "${meme.nome}"?\n\nA API remove todos os memes com esse nome, inclusive os que diferem apenas entre maiúsculas e minúsculas.`
    );
    if (!confirmed) return;

    button.disabled = true;
    setStatus(`Excluindo "${meme.nome}"...`, "loading");
    try {
        await request(`${API_URL}?${nameQuery(meme.nome)}`, { method: "DELETE" });
        setStatus("Meme excluído.", "success");
        await refreshCurrentList();
    } catch (error) {
        setStatus(error.message || "Não foi possível excluir o meme.", "error");
    } finally {
        button.disabled = false;
    }
}

document.querySelectorAll('input[type="url"]').forEach((input) => {
    input.addEventListener("input", () => setHttpUrlValidation(input));
});

document.querySelectorAll('input[required]:not([type="url"]), textarea[required]').forEach((input) => {
    input.addEventListener("input", () => setRequiredTextValidation(input));
});

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = searchForm.elements.nome.value.trim();
    if (!name) {
        await loadMemes();
        return;
    }

    try {
        await searchMemes(name);
    } catch {
        // A mensagem do erro já foi apresentada na interface.
    }
});

document.querySelector("#show-all-button").addEventListener("click", async () => {
    searchForm.reset();
    try {
        await loadMemes();
    } catch {
        // A mensagem do erro já foi apresentada na interface.
    }
});

memeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const imageInput = memeForm.elements.urlImagem;
    setHttpUrlValidation(imageInput);
    memeForm.querySelectorAll('input[required]:not([type="url"]), textarea[required]').forEach(setRequiredTextValidation);
    if (!memeForm.reportValidity()) return;

    const meme = {
        nome: memeForm.elements.nome.value.trim(),
        email: memeForm.elements.email.value.trim(),
        descricao: memeForm.elements.descricao.value.trim(),
        urlImagem: imageInput.value.trim()
    };

    setFormLoading(memeForm, true, "Salvando...");
    setStatus("Salvando meme...", "loading");
    try {
        await request(API_URL, jsonOptions("POST", meme));
        memeForm.reset();
        searchForm.reset();
        currentSearch = "";
        setStatus("Meme cadastrado com sucesso.", "success");
        await loadMemes({ preserveStatus: true });
    } catch (error) {
        setStatus(error.message || "Não foi possível cadastrar o meme.", "error");
    } finally {
        setFormLoading(memeForm, false);
    }
});

document.querySelector("#refresh-button").addEventListener("click", async () => {
    searchForm.reset();
    try {
        await loadMemes();
    } catch {
        // A mensagem do erro já foi apresentada na interface.
    }
});

editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const imageInput = editForm.elements.urlImagem;
    setHttpUrlValidation(imageInput);
    editForm.querySelectorAll('input[required]:not([type="url"]), textarea[required]').forEach(setRequiredTextValidation);
    if (!editForm.reportValidity()) return;

    const id = editForm.elements.id.value;
    const updatedMeme = {
        nome: editForm.elements.nome.value.trim(),
        descricao: editForm.elements.descricao.value.trim(),
        urlImagem: imageInput.value.trim()
    };

    setFormLoading(editForm, true, "Salvando...");
    setStatus("Atualizando meme...", "loading");
    try {
        await request(`${API_URL}?id=${encodeURIComponent(id)}`, jsonOptions("PUT", updatedMeme));
        editDialog.close();
        currentSearch = updatedMeme.nome;
        searchForm.elements.nome.value = updatedMeme.nome;
        setStatus("Meme atualizado.", "success");
        await refreshCurrentList();
    } catch (error) {
        setStatus(error.message || "Não foi possível atualizar o meme.", "error");
    } finally {
        setFormLoading(editForm, false);
    }
});

document.querySelector("#close-dialog").addEventListener("click", () => editDialog.close());
document.querySelector("#cancel-edit").addEventListener("click", () => editDialog.close());

loadMemes().catch(() => {
    // A mensagem do erro já foi apresentada na interface.
});
