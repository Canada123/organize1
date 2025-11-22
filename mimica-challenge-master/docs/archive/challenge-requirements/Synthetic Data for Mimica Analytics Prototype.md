**Synthetic Data for Mimica Analytics Prototype**

 **Motivation and Design Rationale**

 In the first iteration we generated a simple synthetic dataset to stand in for Mimica’s task‑level recordings. While useful for prototyping, that dataset lacked the richness and variability found in real desktop traces. For the second iteration, we **significantly expanded the schema, variant logic and data volume** to better mirror the diversity of invoice approval workflows across regions. The new design was informed by research into typical purchase‑order approval steps. According to a procurement guide, companies follow a series of steps such as **identifying needs**, **identifying suppliers**, obtaining **purchase approval** and finally **issuing the purchase order**[procuredesk.com](https://www.procuredesk.com/purchase-order-approval-process/#:~:text=Steps%20in%20Purchase%20Order%20Approval,Process). We adapted these high‑level stages to the **invoice approval** domain (reading an invoice email, validating invoice data in SAP, checking tolerance thresholds, seeking approvals and recording logs). Our synthetic process builds on Mimica’s example invoice validation workflow while incorporating additional steps that occur in industry (e.g., second approval, local log entry, summary reports).

 **Schema and Fields**

 Each row in the dataset represents a **step** within a **transaction** (end‑to‑end invoice approval instance). The columns are:

| Column | Description |
| ----- | ----- |
| `task_id` | Name of the process (`invoice_approval`). |
| `transaction_id` | Unique identifier per invoice approval instance (500 total). |
| `region` | Region in which the transaction occurred (`Americas`, `EMEA`, `APAC`, `LATAM` or `NorthAmerica`). |
| `user_id` | Pseudonymous identifier for the worker executing the transaction. Multiple users exist per region. |
| `role` | Role of the user (`AP clerk`, `Manager`, `Supervisor`, `Analyst`). Most transactions are performed by clerks; a subset require intervention from managers or supervisors. |
| `variant` | Variant label (`A`, `B`, `C`, `D`, `E`). Represents structural differences in the process (see below). |
| `step_index` | Ordinal position of the step within the transaction (starting at 1). |
| `action_name` | Descriptive name of the action (e.g., `read_email`, `validate_invoice_data`, `manager_approval`). |
| `application` | Application used (e.g., `Outlook`, `SAP`, `Excel`, `PDF Viewer`, `Notepad`). |
| `duration_sec` | Duration of the action in seconds. Durations were drawn from normal distributions tuned for each action type. For example, validating invoice data averages \~40 s while sending an email takes \~20 s. |
| `start_time_sec`/`end_time_sec` | Relative start and end time of the step within the transaction. These allow reconstruction of the timeline and calculation of total transaction duration. |
| `decision_outcome` | Outcome for decision steps such as `check_tolerance` (`within_tolerance`, `exceeds_tolerance`), `send_for_review` (`requires_review`) or final `approve_invoice` (`approved`). Other steps leave this blank. |
| `auto_score` | Synthetic “automatability” score (0–1) reflecting how suitable the action is for automation. Manual logging steps receive higher scores (e.g., 0.9) while SAP operations receive lower scores (0.6–0.7). |

* 

   The dataset contains **4 153 rows** across **500 transactions**. On average each transaction has \~8 steps, with variation depending on the variant chosen.

   **Variant Definitions**

   We modelled five variants to capture regional differences and exception handling:

  1. **Variant A: Standard path** – Follows the baseline invoice approval workflow: read the invoice email, download and open the PDF, validate invoice data in SAP, check whether the invoice total is within the tolerance, approve the invoice, record a log entry and notify the requester. This reflects the majority of transactions.

  2. **Variant B: Requires second approval** – Adds a `manager_approval` step after the invoice approval. This models policies where high‑value or high‑risk invoices require manager sign‑off[procuredesk.com](https://www.procuredesk.com/purchase-order-approval-process/#:~:text=Purchase%20Approval). Manager approval is the slowest step on average (≈ 59 s).

  3. **Variant C: Local log entry** – Inserts an `update_local_log` step (in `Notepad` or `Excel`) after recording the primary log. This reflects regions that maintain a local log in addition to the corporate system. The step takes around 20 s.

  4. **Variant D: Early termination** – When the tolerance check detects the invoice exceeds the allowed threshold, the flow branches to `send_for_review` and terminates. This variant has fewer steps and overall lower duration. The `send_for_review` action averages \~50 s and sets the decision outcome to `requires_review`.

  5. **Variant E: Summary report** – Adds a `compile_summary` step before notification, where clerks prepare a summary report for stakeholders. The step takes about 35 s.

* Variants are sampled per region with different probabilities (e.g., regions with stricter governance have more variant B transactions). This introduces realistic heterogeneity in variant distribution.

   **Data Generation Methodology**

   We wrote a Python script to generate the dataset. Key aspects include:

  1. **Randomised sampling** – For each of 500 transactions, we randomly assigned a region, user role and variant based on weighted probabilities. We then assembled the list of steps for that variant by inserting or replacing steps in the standard template. Durations were drawn from normal distributions with action‑specific means and standard deviations to simulate natural variability.

  2. **Decision outcomes** – The `check_tolerance` step sets `decision_outcome` to `exceeds_tolerance` for \~20 % of transactions; otherwise `within_tolerance`. Branching into variant D uses this outcome to skip the approval and logging steps and instead perform `send_for_review` and `end_process`.

  3. **Automata scores** – Steps performed in productivity tools like Excel or Notepad are given higher automata scores (≈ 0.9) because they involve structured data entry, whereas steps in SAP receive moderate scores (≈ 0.6). These scores could feed an eventual recommendation engine for automation.

  4. **Data export** – The script writes the dataset to both CSV (`new_synthetic_invoice_data.csv`) and JSON (`new_synthetic_invoice_data.json`) formats. It also computes aggregated metrics (see next section) and outputs processed JSON files ready for front‑end consumption.

* The code is included in the repository (see `data_generation.py`). Running the script produces a reproducible dataset for subsequent analysis.

   **Processed Metrics and Insights**

   After generating the raw dataset, we computed several metrics to support the analytics dashboards. These metrics are stored in separate JSON files:

  1. **Region metrics (`processed_region_metrics.json`)** – For each region, we calculated the mean, median, minimum and maximum transaction durations, the average step count and the number of transactions. The average total duration varies narrowly across regions (≈ 181–185 s). LATAM has the longest average duration (≈ 185.5 s) and the highest step count (≈ 8.4 steps per transaction).

  2. **Variant distribution (`processed_variant_distribution.json`)** – A pivot table showing the count of transactions by region and variant. For example, the Americas region has more variant B (second approval) transactions than APAC, while LATAM shows a relatively high number of variant C (local log) executions. This supports the cross‑region comparison dashboard.

  3. **Variant metrics (`processed_variant_metrics.json`)** – Aggregated statistics per variant: average and median transaction duration, average step count and number of transactions. Variant B has the highest mean duration (≈ 222 s) due to the added manager approval, whereas variant D has the fewest steps and the shortest average duration.

  4. **Step‑level metrics (`processed_step_metrics.json`)** – Average and median duration and count for each action. This is used for bottleneck detection. The top bottlenecks are `manager_approval` (\~58.6 s), `send_for_review` (\~49.8 s), `validate_invoice_data` (\~40 s), `compile_summary` (\~36 s) and `check_tolerance` (\~30 s). These steps warrant attention when standardising processes.

  5. **Top bottlenecks (`processed_top_bottlenecks.json`)** – A subset of the step‑level metrics containing only the five actions with the highest average duration. This drives the bottleneck detection component.

* These processed files feed the visual components in the next‑generation analytics platform. For example, the **cross‑region comparison dashboard** will plot `avg_duration` and `transaction_count` per region; the **variant analysis** view will display the counts in the variant distribution matrix; and the **bottleneck detection** table will highlight slow actions with their average durations and occurrence counts.

   **Key Takeaways**

  1. The enriched synthetic dataset more closely resembles real Mimica recordings by incorporating user roles, variant logic, decision outcomes and heterogeneity across regions.

  2. Aggregated metrics provide immediate insights: regions differ only slightly in average transaction duration, but variant distribution and bottleneck steps reveal deeper differences.

  3. Manager approval and send‑for‑review steps emerge as the biggest bottlenecks, supporting the hypothesis that approval stages drive cycle time. This insight can guide process standardisation efforts.

  4. The data pipeline produces ready‑to‑use JSON files for each planned dashboard component, ensuring a clean separation between data processing and front‑end presentation.

By iterating on the synthetic data and analysis pipeline, we lay a more realistic foundation for the analytics platform prototype. The next step will be to translate these processed datasets into interactive visualisations using 21st dev and shadcn/ui components in a Next.js application. 

**Data Transformation and Analysis Pipeline**

 This document details the end‑to‑end transformation of the enriched synthetic invoice‑approval dataset into processed data structures ready for the analytics dashboards. The goal is to transparently document each step, ensuring reproducibility and providing clear specifications for the inputs expected by each visual component.

 **1\. Loading the raw dataset**

 The raw data resides in `new_synthetic_invoice_data.csv` (and a JSON equivalent). Each row represents a **step** executed during a transaction. To begin analysis, load the dataset into a DataFrame or similar structure:

 python  
CopyEdit  
`import pandas as pd`  
`df = pd.read_csv('new_synthetic_invoice_data.csv')`

*  Key columns of interest:

  1. `transaction_id` – groups steps belonging to the same end‑to‑end invoice approval.

  2. `region` – used for cross‑region comparison.

  3. `variant` – indicates structural differences in the process.

  4. `action_name` – step names used for bottleneck detection.

  5. `duration_sec` – duration of each step.

  6. `step_index` – used to count steps per transaction.

**2\. Computing transaction‑level metrics**

 For cross‑region and variant analysis we need to summarise each transaction. This involves grouping by `transaction_id`, summing durations and counting steps:

 python  
CopyEdit  
`txn_summary = df.groupby(['transaction_id','region','variant']).agg(`  
    `total_duration=('duration_sec','sum'),`  
    `step_count=('step_index','max')`  
`).reset_index()`

*  This summary table contains one row per transaction with the total time and number of steps executed.

   **3\. Region metrics**

   The **cross‑region comparison dashboard** requires aggregated statistics per region. We compute the following metrics:

  1. **`avg_duration`** – mean of `total_duration` for transactions in the region.

  2. **`median_duration`** – median of `total_duration`.

  3. **`min_duration`** and **`max_duration`** – range of durations.

  4. **`avg_step_count`** – mean of `step_count` per transaction.

  5. **`transaction_count`** – number of transactions.

Implementation:

 python  
CopyEdit  
`region_metrics = txn_summary.groupby('region').agg(`  
    `avg_duration=('total_duration','mean'),`  
    `median_duration=('total_duration','median'),`  
    `max_duration=('total_duration','max'),`  
    `min_duration=('total_duration','min'),`  
    `avg_step_count=('step_count','mean'),`  
    `transaction_count=('transaction_id','count')`  
`).reset_index()`  
 The resulting DataFrame is exported to `processed_region_metrics.json` for the front‑end. It will feed the **cross‑region bar charts** and summary cards.

 **4\. Variant distribution by region**

 To understand which variants are prevalent in each region, we pivot the transaction summary table:

 python  
CopyEdit  
`variant_distribution = txn_summary.pivot_table(`  
    `index='region',`  
    `columns='variant',`  
    `values='transaction_id',`  
    `aggfunc='count',`  
    `fill_value=0`  
`).reset_index()`  
 The output is a table where each row corresponds to a region and each column (A, B, C, D, E) lists the count of transactions following that variant. This table is exported as `processed_variant_distribution.json` and used by the **variant analysis** dashboard.

 **5\. Variant metrics**

 While the previous step looks at variant counts per region, we also compute metrics per variant across all regions. This helps assess the impact of structural differences on duration and step counts:

 python  
CopyEdit  
`variant_metrics = txn_summary.groupby('variant').agg(`  
    `avg_duration=('total_duration','mean'),`  
    `median_duration=('total_duration','median'),`  
    `step_count=('step_count','mean'),`  
    `transaction_count=('transaction_id','count')`  
`).reset_index()`  
 These metrics (exported as `processed_variant_metrics.json`) drive variant‑focused charts, such as comparing average duration and frequency across variants.

 **6\. Step‑level metrics and bottleneck detection**

 To identify bottlenecks, we aggregate by `action_name`:

 python  
CopyEdit  
`step_metrics = df.groupby('action_name').agg(`  
    `avg_duration=('duration_sec','mean'),`  
    `median_duration=('duration_sec','median'),`  
    `count=('duration_sec','count')`  
`).reset_index().sort_values('avg_duration', ascending=False)`

`top_bottlenecks = step_metrics.nlargest(5, 'avg_duration')`

*  The `step_metrics` dataset lists every action with its average and median duration and the number of occurrences. The sorted `top_bottlenecks` captures the five slowest actions (e.g., `manager_approval`, `send_for_review`, `validate_invoice_data`). We export both as JSON files: `processed_step_metrics.json` and `processed_top_bottlenecks.json`. These data sets populate the **bottleneck table** in the analytics platform.

   **7\. Data specifications for each visual component**

   For clarity, the table below outlines the processed dataset used by each planned visual component:

| Visual component | Input data structure | Key fields |
| ----- | ----- | ----- |
| **Cross‑region comparison bar chart** | `processed_region_metrics.json` (array of region objects) | `region`, `avg_duration`, `transaction_count`, optionally `avg_step_count` |
| **Region summary cards** | `processed_region_metrics.json` | `median_duration`, `max_duration`, `min_duration` |
| **Variant distribution stacked bar chart** | `processed_variant_distribution.json` | `region`, counts of variants `A`–`E` |
| **Variant metrics comparison chart** | `processed_variant_metrics.json` | `variant`, `avg_duration`, `median_duration`, `step_count`, `transaction_count` |
| **Bottleneck detection table** | `processed_top_bottlenecks.json` (and full `processed_step_metrics.json` for drill‑down) | `action_name`, `avg_duration`, `median_duration`, `count` |

 Each JSON file is structured as a list of objects that can be directly consumed by the front‑end. For example, `processed_region_metrics.json` looks like:

 json  
CopyEdit  
`[`  
  `{`  
    `"region": "APAC",`  
    `"avg_duration": 182.3998,`  
    `"median_duration": 184.045,`  
    `"max_duration": 253.22,`  
    `"min_duration": 116.07,`  
    `"avg_step_count": 8.20,`  
    `"transaction_count": 102`  
  `},`  
  `...`  
`]`

*  The front‑end can map these fields to chart props without additional transformation.

   **8\. Reproducibility and limitations**

  1. **Randomness** – The data generation process uses pseudo‑random sampling. Seeding the random number generator ensures reproducible outputs; changing the seed can produce different distributions for experimentation.

  2. **Simplifications** – Although the dataset includes realistic variability, it remains a simplification of real Mimica data. For example, durations are drawn from normal distributions and do not account for network latency, user interruptions, or multi‑tasking. Also, certain approvals are modelled as single steps rather than sequences of sub‑actions.

  3. **Next steps** – Future iterations could incorporate additional attributes (e.g., vendor size, invoice amount), use more sophisticated statistical models for durations (log‑normal distributions are common for task times), and calibrate parameters against real data if available.

* By detailing the transformation pipeline and clearly specifying the processed data structures, we ensure that both the data scientist and front‑end developer know exactly what inputs are available for building the analytics dashboard.

* Enhanced synthetic dataset (CSV & JSON): [new\_synthetic\_invoice\_data.csv](https://chatgpt.com/backend-api/estuary/content?id=file-C3X1EtNNy8CY3457YhHT4b&ts=487170&p=fsns&cid=1&sig=97583392ecd0376c1f84b9df73e23522dca8e9831283de07f60acbe9d00d27e4), [new\_synthetic\_invoice\_data.json](https://chatgpt.com/backend-api/estuary/content?id=file-KEGSEnvsgqJukbCPZ6csEc&ts=487170&p=fsns&cid=1&sig=d86445f1e0de90cbc722bcbcea017a3290afa73acbca03918c8aaf9b217ab3db)

* Processed metrics ready for the dashboard: region metrics [processed\_region\_metrics.json](https://chatgpt.com/backend-api/estuary/content?id=file-DAy3Xpmj7SCwfTBRaK7R19&ts=487170&p=fsns&cid=1&sig=d8a0efc63a9f7c7928e50ac590e5d5490c29d5f3ede3d65d0f5728d207e36624), variant distribution [processed\_variant\_distribution.json](https://chatgpt.com/backend-api/estuary/content?id=file-7Bj1XNbmhc7Kr69v9k89xF&ts=487170&p=fsns&cid=1&sig=c4fd10390cf24f1424dfa0171d4fe11d77bc573a7f14954016c3de9eb7c15e2f), variant metrics [processed\_variant\_metrics.json](https://chatgpt.com/backend-api/estuary/content?id=file-XBvzJKUPnpSKzCDhxAknNE&ts=487170&p=fsns&cid=1&sig=c34e39b04cb836be8a177b563f625f3371a0caf1c2fc13fb4a944975654373de), top bottlenecks [processed\_top\_bottlenecks.json](https://chatgpt.com/backend-api/estuary/content?id=file-Sgh8p8bUtS3Lxbz9nwp5qF&ts=487170&p=fsns&cid=1&sig=c07be6e3199a1aefbd1ac22f93e0dbbe91009b038069e14b1f8c3921b6caa0ce), and full step metrics [processed\_step\_metrics.json](https://chatgpt.com/backend-api/estuary/content?id=file-8wwctuzQA3tzhkr9HoA6F9&ts=487170&p=fsns&cid=1&sig=f2394129b1d7f3ef7c3194356847bb352095b12d9e81ee721230e6549d004127)

