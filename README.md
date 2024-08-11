# Female Headliners at UK Music Festivals

Welcome to the **Female Headliners at UK Music Festivals** project! This repository contains a static front-end data visualization project focused on exploring the representation of female artists as headliners at major UK music festivals from 1997 to 2017.

<img width="1234" alt="Screenshot 2024-08-11 at 18 14 44" src="https://github.com/user-attachments/assets/6227e6db-5e13-4b82-9740-24cfad551ee1">

## Overview

This project aims to understand the identities of female artists who have headlined music festivals in the UK during the late 20th and early 21st centuries. The visualization provides insights into the gender distribution of headliners across 13 of the largest UK music festivals, highlighting trends, outliers, and key statistics.

## Data

- **Dataset URL:** [BBC Data Unit - Festival Headliners](https://github.com/BBC-Data-Unit/music-festivals/blob/master/festival_headliners.csv)
- **Attributes:**
  - `stage name`: Artist or group name.
  - `festival`: Name of the festival.
  - `year`: Year of performance.
  - `gender`: Gender of the artist/group.
  - `birthplace`: Birthplace of the artist/group.
  - `solo/band`: Whether the act is a solo artist or a band.
  - `ethnicity`: Ethnicity of the artist/group.
  - `age`: Age of the artist/group at the time of performance.
  - `formation`: Year the group was formed or the solo artist's career began.
  - `city`: The city where the festival is held.

### Data Preprocessing

The data was preprocessed using Python in a Jupyter Notebook with the following steps:
1. Removed irrelevant columns such as `second location`, `second city`, and `year inducted`.
2. Standardized column names to lowercase and replaced spaces with underscores.
3. Updated artist ages to reflect the current year (2023).
4. Categorized gender into three groups: `f` (female), `mixed`, and `other`.

## Visualization Goals

This project uses a combination of abstract tasks to achieve the following goals:

1. **Compare Correlation:** Understand the distribution of female, mixed, and other gender headliners across festivals.
2. **Summarize Distribution:** Provide an overview of the gender of all headliners.
3. **Identify Outliers:** Locate and highlight female and mixed-gender headliners as outliers.
4. **Annotate Features:** Display detailed information about artists and the number of festivals they have headlined.
5. **Record Findings:** Allow users to record and track specific artists as they explore the visualization.

## Visualization Design

- **Color Scheme:** A binary color palette from ColorBrewer is used to differentiate between headliners containing female artists (`#d01c8b` for female, `#4dac26` for mixed).
- **Interactivity:** The visualization includes interactive elements such as hover effects and scrolling, allowing users to explore the data in depth.

## Credits

- **Jim Vallandingham's scroller.js** was used to implement the scrolling functionality.
- Additional code was adapted from various sources for grouped bar plots, rotating axis ticks, and smooth transitions.

## How to Use

To view the visualization:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/female-headliners-uk-music-festivals.git
   
2. **Open the index.html file in your browser:**
  Navigate to the cloned directory and double-click index.html to view the visualization.

Contact
For any inquiries or contributions, please reach out to matildaglynnh@gmail.com
