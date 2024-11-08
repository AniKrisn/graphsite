// Array to hold problems
let problems = [];

// Function to render problems list
function renderProblems() {
    const problemsList = document.getElementById('problemsList');
    problemsList.innerHTML = '';
    problems.forEach((problem, index) => {
        const problemDiv = document.createElement('div');
        problemDiv.className = 'problem-item';
        problemDiv.innerHTML = `
            <strong>${problem.name}</strong> - 
            <a href="${problem.link}" target="_blank">${problem.link}</a>
            <p>Tags: ${problem.tags.join(', ')}</p>
        `;
        problemsList.appendChild(problemDiv);
    });
    renderGraph();
}

// Function to render graph
function renderGraph() {
    const container = document.getElementById('graphContainer');
    container.innerHTML = ''; // Clear previous graph

    // Create a simple force-directed graph (using D3.js or similar)
    const nodes = problems.map((p, i) => ({ id: i, label: p.name }));
    const links = [];

    // Connect nodes by common tags
    for (let i = 0; i < problems.length; i++) {
        for (let j = i + 1; j < problems.length; j++) {
            const commonTags = problems[i].tags.filter(tag => problems[j].tags.includes(tag));
            if (commonTags.length > 0) {
                links.push({ source: i, target: j });
            }
        }
    }

    // Simple graph setup using Cytoscape.js for visualization
    const cy = cytoscape({
        container: container,
        elements: {
            nodes: nodes.map(n => ({ data: { id: n.id, label: n.label } })),
            edges: links.map(l => ({ data: { source: l.source, target: l.target } }))
        },
        style: [
            { selector: 'node', style: { 'label': 'data(label)', 'background-color': '#0074D9' } },
            { selector: 'edge', style: { 'line-color': '#ddd' } }
        ],
        layout: { name: 'cose' }
    });
}

// Handle form submission
document.getElementById('problemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('problemName').value;
    const link = document.getElementById('problemLink').value;
    const tags = document.getElementById('problemTags').value.split(',').map(tag => tag.trim());

    problems.push({ name, link, tags });
    renderProblems();

    // Reset the form
    e.target.reset();
});

// Initial render
renderProblems();
