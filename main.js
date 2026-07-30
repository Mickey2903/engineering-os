const { ItemView, Menu, Modal, Notice, Plugin, Setting, normalizePath } = require("obsidian");

const VIEW_TYPE = "plc-engineering-sidebar";
const DOMAIN_FOLDERS = {
  PWR: "05 Common Hardware/Power", CPU: "05 Common Hardware/CPU", MEM: "05 Common Hardware/Memory",
  ETH: "05 Common Hardware/Ethernet", USB: "05 Common Hardware/USB", RTC: "05 Common Hardware/RTC",
  CAN: "05 Common Hardware/CAN FD", BUS: "05 Common Hardware/Expansion Bus",
  DIN: "05 Common Hardware/Digital Inputs", DOUT: "05 Common Hardware/Digital Outputs",
  AIN: "05 Common Hardware/Analog Inputs", AOUT: "05 Common Hardware/Analog Outputs",
  EMC: "05 Common Hardware/EMC", FW: "06 Firmware", IDE: "07 IDE",
  NMP: "08 Communication/NMP", MECH: "09 Mechanical"
};
const DOMAIN_NAMES = {
  PWR: "Power", CPU: "CPU", MEM: "Memory", ETH: "Ethernet", USB: "USB", RTC: "RTC",
  CAN: "CAN FD", BUS: "Expansion Bus", DIN: "Digital Inputs", DOUT: "Digital Outputs",
  AIN: "Analog Inputs", AOUT: "Analog Outputs", EMC: "EMC", FW: "Firmware",
  IDE: "IDE", NMP: "NMP", MECH: "Mechanical"
};

module.exports = class PlcEngineeringPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE, leaf => new EngineeringSidebarView(leaf, this));
    this.addRibbonIcon("wrench", "PLC Engineering", evt => this.openRibbonMenu(evt));

    const open = kind => new EngineeringDocumentModal(this.app, this, kind).open();
    this.addCommand({ id: "open-engineering-sidebar", name: "Open engineering sidebar", callback: () => this.activateSidebar() });
    this.addCommand({ id: "create-engineering-document", name: "Create engineering document", callback: () => open("requirement") });
    this.addCommand({ id: "create-requirement", name: "Create requirement", callback: () => open("requirement") });
    this.addCommand({ id: "create-verification-case", name: "Create verification case", callback: () => open("verification") });
    this.addCommand({ id: "create-adr", name: "Create ADR", callback: () => open("adr") });
    this.addCommand({ id: "create-component", name: "Create component", callback: () => open("component") });
    this.addCommand({ id: "refresh-engineering-sidebar", name: "Refresh engineering sidebar", callback: () => this.refreshSidebar() });
  }

  onunload() { this.app.workspace.detachLeavesOfType(VIEW_TYPE); }

  openRibbonMenu(evt) {
    const menu = new Menu();
    menu.addItem(i => i.setTitle("Open engineering sidebar").setIcon("layout-dashboard").onClick(() => this.activateSidebar()));
    menu.addSeparator();
    menu.addItem(i => i.setTitle("New requirement").setIcon("file-plus").onClick(() => new EngineeringDocumentModal(this.app, this, "requirement").open()));
    menu.addItem(i => i.setTitle("New verification case").setIcon("check-square").onClick(() => new EngineeringDocumentModal(this.app, this, "verification").open()));
    menu.addItem(i => i.setTitle("New ADR").setIcon("git-branch").onClick(() => new EngineeringDocumentModal(this.app, this, "adr").open()));
    menu.addItem(i => i.setTitle("New component").setIcon("cpu").onClick(() => new EngineeringDocumentModal(this.app, this, "component").open()));
    menu.showAtMouseEvent(evt);
  }

  async activateSidebar() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }

  refreshSidebar() {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
      if (leaf.view && leaf.view.render) leaf.view.render();
    }
  }

  async createDocument(input) {
    const id = this.nextId(input);
    const folder = this.destinationFolder(input);
    await this.ensureFolder(folder);
    const safeTitle = input.title.replace(/[\\/:*?"<>|#^[\]]/g, "-").trim();
    const path = normalizePath(`${folder}/${id} - ${safeTitle}.md`);
    if (this.app.vault.getAbstractFileByPath(path)) throw new Error(`File already exists: ${path}`);
    const file = await this.app.vault.create(path, this.renderDocument(input, id));
    await this.app.workspace.getLeaf(true).openFile(file);
    this.refreshSidebar();
    new Notice(`${id} created`);
  }

  destinationFolder(input) {
    if (input.kind === "adr") return "12 Decisions (ADR)";
    if (input.kind === "component") return "16 Components";
    if (input.kind === "verification") return "11 Verification/Test Cases";
    return DOMAIN_FOLDERS[input.domain] || `02 Platform Requirements/${input.domain}`;
  }

  async ensureFolder(folder) {
    const parts = normalizePath(folder).split("/");
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.app.vault.getAbstractFileByPath(current)) await this.app.vault.createFolder(current);
    }
  }

  nextId(input) {
    let prefix;
    if (input.kind === "adr") prefix = "ADR";
    else if (input.kind === "component") prefix = "CMP";
    else if (input.kind === "verification") prefix = `VER-${input.domain}`;
    else prefix = `${input.level || "SYS"}-${input.domain}`;
    const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`^${escaped}-(\\d{3,4})\\b`);
    let highest = 0;
    for (const file of this.app.vault.getMarkdownFiles()) {
      const match = file.basename.match(pattern);
      if (match) highest = Math.max(highest, Number(match[1]));
    }
    return `${prefix}-${String(highest + 1).padStart(input.kind === "adr" ? 4 : 3, "0")}`;
  }

  renderDocument(input, id) {
    const date = new Date().toISOString().slice(0, 10);
    const esc = String(input.title).replace(/"/g, '\\"');
    const parent = input.parent ? `parent: "[[${input.parent.replace(/"/g, '\\"')}]]"\n` : "parent:\n";
    const common = `---\ntype: ${input.kind}\nid: ${id}\ntitle: "${esc}"\nstatus: ${input.status || "draft"}\npriority: ${input.priority || "medium"}\ndomain: ${input.domain || "GEN"}\nlevel: ${input.level || ""}\n${parent}created: ${date}\nupdated: ${date}\nrevision: 0.1\ntags:\n  - engineering/${input.kind}\n---\n\n# ${id} — ${input.title}\n`;
    if (input.kind === "requirement") return `${common}\n## Requirement\n\n${input.description || ""}\n\n## Rationale\n\n${input.rationale || ""}\n\n## Acceptance criteria\n\n- [ ] ${input.acceptance || ""}\n\n## Traceability\n\n### Parent\n\n${input.parent ? `[[${input.parent}]]` : ""}\n\n### Derived requirements\n\n\n### Design\n\n\n### Verification\n`;
    if (input.kind === "verification") return `${common}\n## Requirement under test\n\n${input.parent ? `[[${input.parent}]]` : ""}\n\n## Objective\n\n${input.description || ""}\n\n## Equipment\n\n\n## Preconditions\n\n\n## Procedure\n\n1. \n\n## Expected result\n\n${input.acceptance || ""}\n\n## Result\n\n- Status: not-run\n- Evidence:\n`;
    if (input.kind === "adr") return `${common}\n## Context\n\n${input.description || ""}\n\n## Decision\n\n\n## Alternatives considered\n\n\n## Consequences\n\n\n## Related requirements\n`;
    return `${common}\n## Function\n\n${input.description || ""}\n\n## Manufacturer and part number\n\n\n## Key ratings\n\n\n## Datasheet\n\n\n## Selection rationale\n\n${input.rationale || ""}\n\n## Alternatives\n\n\n## Lifecycle and sourcing\n\n\n## Used in\n`;
  }

  getStats() {
    const stats = { requirements: 0, verification: 0, adr: 0, components: 0, draft: 0 };
    for (const file of this.app.vault.getMarkdownFiles()) {
      const name = file.basename;
      if (/^(USR|SYS|ARCH|MD|SUB)-[A-Z0-9]+-\d{3}\b/.test(name)) stats.requirements++;
      if (/^VER-[A-Z0-9]+-\d{3}\b/.test(name)) stats.verification++;
      if (/^ADR-\d{4}\b/.test(name)) stats.adr++;
      if (/^CMP-\d{3}\b/.test(name)) stats.components++;
      const cache = this.app.metadataCache.getFileCache(file);
      if (cache && cache.frontmatter && cache.frontmatter.status === "draft") stats.draft++;
    }
    return stats;
  }
};

class EngineeringSidebarView extends ItemView {
  constructor(leaf, plugin) { super(leaf); this.plugin = plugin; }
  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return "PLC Engineering"; }
  getIcon() { return "wrench"; }
  async onOpen() { this.render(); }
  render() {
    const c = this.containerEl.children[1];
    c.empty(); c.addClass("plc-eng-sidebar");
    c.createEl("h3", { text: "PLC Engineering" });
    const actions = c.createDiv({ cls: "plc-eng-actions" });
    this.button(actions, "New requirement", "file-plus", () => new EngineeringDocumentModal(this.app, this.plugin, "requirement").open());
    this.button(actions, "New verification case", "check-square", () => new EngineeringDocumentModal(this.app, this.plugin, "verification").open());
    this.button(actions, "New ADR", "git-branch", () => new EngineeringDocumentModal(this.app, this.plugin, "adr").open());
    this.button(actions, "New component", "cpu", () => new EngineeringDocumentModal(this.app, this.plugin, "component").open());
    const s = this.plugin.getStats();
    const grid = c.createDiv({ cls: "plc-eng-stats" });
    this.stat(grid, s.requirements, "Requirements"); this.stat(grid, s.verification, "Tests");
    this.stat(grid, s.adr, "ADRs"); this.stat(grid, s.components, "Components");
    c.createEl("h4", { text: "Draft documents" });
    c.createEl("p", { text: String(s.draft), cls: "plc-eng-muted" });
    c.createEl("h4", { text: "Domains" });
    const ul = c.createEl("ul", { cls: "plc-eng-list" });
    for (const [code, name] of Object.entries(DOMAIN_NAMES)) {
      const count = this.app.vault.getMarkdownFiles().filter(f => f.basename.includes(`-${code}-`)).length;
      if (count > 0) ul.createEl("li", { text: `${name}: ${count}` });
    }
  }
  button(parent, text, icon, click) { const b = parent.createEl("button", { text }); b.onclick = click; }
  stat(parent, value, label) { const d = parent.createDiv({ cls: "plc-eng-stat" }); d.createEl("strong", { text: String(value) }); d.createEl("span", { text: label }); }
}

class EngineeringDocumentModal extends Modal {
  constructor(app, plugin, initialKind = "requirement") {
    super(app); this.plugin = plugin; this.kind = initialKind; this.titleValue = ""; this.domain = "PWR";
    this.level = "SYS"; this.status = "draft"; this.priority = "medium"; this.parentValue = "";
    this.description = ""; this.rationale = ""; this.acceptance = "";
  }
  onOpen() { this.draw(); }
  draw() {
    this.contentEl.empty(); this.modalEl.addClass("plc-engineering-modal"); this.titleEl.setText("Engineering document wizard");
    new Setting(this.contentEl).setName("Document type").addDropdown(d => d.addOptions({ requirement:"Requirement", verification:"Verification case", adr:"ADR", component:"Component" }).setValue(this.kind).onChange(v => { this.kind=v; this.draw(); }));
    if (this.kind === "requirement") new Setting(this.contentEl).setName("Requirement level").addDropdown(d => d.addOptions({USR:"User",SYS:"System",ARCH:"Architecture",MD:"Module design",SUB:"Submodule"}).setValue(this.level).onChange(v=>this.level=v));
    if (this.kind !== "adr" && this.kind !== "component") new Setting(this.contentEl).setName("Domain").addDropdown(d => { for (const [k,v] of Object.entries(DOMAIN_NAMES)) d.addOption(k, `${k} — ${v}`); d.setValue(this.domain).onChange(v=>this.domain=v); });
    new Setting(this.contentEl).setName("Title").addText(t => { t.setPlaceholder("Nominal input voltage range").setValue(this.titleValue).onChange(v=>this.titleValue=v.trim()); setTimeout(()=>t.inputEl.focus(),0); });
    new Setting(this.contentEl).setName("Status").addDropdown(d=>d.addOptions({draft:"Draft",review:"In review",approved:"Approved",deprecated:"Deprecated"}).setValue(this.status).onChange(v=>this.status=v));
    new Setting(this.contentEl).setName("Priority").addDropdown(d=>d.addOptions({low:"Low",medium:"Medium",high:"High",critical:"Critical"}).setValue(this.priority).onChange(v=>this.priority=v));
    if (this.kind === "requirement" || this.kind === "verification") new Setting(this.contentEl).setName("Parent / requirement ID").setDesc("Optional, e.g. USR-PWR-001").addText(t=>t.setValue(this.parentValue).onChange(v=>this.parentValue=v.trim()));
    new Setting(this.contentEl).setName(this.kind === "adr" ? "Context" : "Description").addTextArea(t=>t.setValue(this.description).onChange(v=>this.description=v));
    if (this.kind === "requirement" || this.kind === "component") new Setting(this.contentEl).setName("Rationale").addTextArea(t=>t.setValue(this.rationale).onChange(v=>this.rationale=v));
    if (this.kind === "requirement" || this.kind === "verification") new Setting(this.contentEl).setName(this.kind === "requirement" ? "First acceptance criterion" : "Expected result").addTextArea(t=>t.setValue(this.acceptance).onChange(v=>this.acceptance=v));
    new Setting(this.contentEl).addButton(b=>b.setButtonText("Create document").setCta().onClick(async()=>{
      if(!this.titleValue) return new Notice("Enter a title");
      try { await this.plugin.createDocument({kind:this.kind,title:this.titleValue,domain:this.domain||"GEN",level:this.level,status:this.status,priority:this.priority,parent:this.parentValue,description:this.description,rationale:this.rationale,acceptance:this.acceptance}); this.close(); }
      catch(e){ console.error(e); new Notice(`Could not create document: ${e.message || e}`); }
    }));
  }
  onClose(){ this.contentEl.empty(); }
}
