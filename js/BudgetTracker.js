export default class BudgetTracker {
    constructor(querySelectorString) {
        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = BudgetTracker.html();
        this.root.querySelector(".new-Entry").addEventListener("click", () => {
            this.onNewEntryBtnClick();
        });
        this.load();
    }
    static html() {
        return `
        <table class="budget-tracker">
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <!-- <th>Amount</th> -->


            </tr>
        </thead>
        <tbody class="entries">
        </tbody>
        <tbody>
            <tr>
                <td colspan="5" class="controls"> <button type="button" class="new-Entry">New-Entry</button></td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="5" class="summary">
                    <strong>Total:</strong>  <span class="Total">&#8377;0.00</span>


                </td>
            </tr>
        </tfoot>
    </table>

        `;
    }
    static entryHtml() {
        return `    <tr>
      <td><input class="input input-date" type="date"></td>
      <td><input class="input input-description" type="text" placeholder="add expenses"></td>
      <td><select class="input input-type">
              <option value="income">Income</option>
              <option value="expense">Expence</option>
          </select>
      </td>
      <td><input type="number" class="input input-amount" placeholder=&#8377;></td>
      <td><button type="button" class="delete-btn">&#10005;</button></td>
  </tr>
        `
    }
    load() {
        const entries = JSON.parse(localStorage.getItem("BudgetTracker-new-Entries") || "[]");
        console.log(entries);
        for (const entrie of entries) {
            this.addEntry(entrie);
        }
        this.updateSummary();
    }
    updateSummary() {
        const total=this.getEntryRows().reduce((total,row)=>{
            const amount=row.querySelector(".input-amount").value;
            const isExpence=row.querySelector(".input-type").value==="expense";
            const modifier=isExpence? -1: 1;
            return total+(amount*modifier);

        },0)
        const totalFormat= new Intl.NumberFormat("en-In",{
            style:"currency",
            currency:"INR",
        }).format(total);
        this.root.querySelector(".Total").textContent=totalFormat;

    }
    addEntry(entrie = {}) {
        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());
        const row = this.root.querySelector(".entries tr:last-of-type");
        row.querySelector(".input-date").value = entrie.date || new Date().toISOString().replace(/T.*/, "");
        row.querySelector(".input-description").value = entrie.description || "";
        row.querySelector(".input-type").value = entrie.type || "income";
        row.querySelector(".input-amount").value = entrie.amount || 0;
        row.querySelector(".delete-btn").addEventListener("click", e => {
            this.onDeleteEntryBtnClcik(e);
        })
        row.querySelectorAll(".input").forEach(input => {
            input.addEventListener("change", () => this.save());
        })
    }
    onNewEntryBtnClick() {
        this.addEntry();
    }
    onDeleteEntryBtnClcik(e) {
        e.target.closest("tr").remove();
        this.save();
    }
    save() {
        const data = this.getEntryRows().map(row => {
            return {
                date: row.querySelector(".input-date").value,
                description: row.querySelector(".input-description").value,
                type: row.querySelector(".input-type").value,
                amount: parseFloat(row.querySelector(".input-amount").value),
            };
        });
        localStorage.setItem("BudgetTracker-new-Entries", JSON.stringify(data));
        this.updateSummary();
    }
    getEntryRows() {
        return Array.from(this.root.querySelectorAll(".entries tr"));
    }

}