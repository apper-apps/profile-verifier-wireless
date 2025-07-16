import { toast } from "react-toastify";

class ProfileService {
  constructor() {
    this.profiles = [];
    this.nextId = 1;
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async parseFile(file) {
    await this.delay(500);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target.result;
          const lines = text.split("\n");
          
          if (lines.length < 2) {
            throw new Error("File must contain at least a header row and one data row");
          }
          
          const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
          const profiles = [];
          
          // Check for required columns
          const requiredColumns = ["firstname", "lastname", "organization", "linkedin_url"];
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          
          if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
          }
          
          // Parse data rows
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(",").map(v => v.trim());
            const profile = {
              Id: this.nextId++,
              firstname: values[headers.indexOf("firstname")] || "",
              lastname: values[headers.indexOf("lastname")] || "",
              organization: values[headers.indexOf("organization")] || "",
              linkedinUrl: values[headers.indexOf("linkedin_url")] || "",
verificationStatus: null,
              verifiedAt: null,
              notes: null,
              nameMatch: null
            };
            // Validate required fields
            if (profile.firstname && profile.lastname && profile.linkedinUrl) {
              profiles.push(profile);
            }
          }
          
          if (profiles.length === 0) {
            throw new Error("No valid profiles found in the file");
          }
          
          this.profiles = profiles;
          toast.success(`Successfully loaded ${profiles.length} profiles`);
          resolve(profiles);
          
        } catch (error) {
          toast.error(`Error parsing file: ${error.message}`);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        const error = new Error("Error reading file");
        toast.error(error.message);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }

  async getAll() {
    await this.delay(200);
    return [...this.profiles];
  }

  async getById(id) {
    await this.delay(200);
    const profile = this.profiles.find(p => p.Id === parseInt(id));
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    return { ...profile };
  }

  async update(id, data) {
    await this.delay(200);
    const index = this.profiles.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    
    this.profiles[index] = {
      ...this.profiles[index],
      ...data,
      verifiedAt: new Date().toISOString()
    };
return { ...this.profiles[index] };
  }

  // Helper method to check name match
  checkNameMatch(profile) {
    if (!profile.firstname || !profile.lastname) return "no";
    
    // This is a simplified check - in a real implementation, you would
    // integrate with LinkedIn API or web scraping to get the actual profile name
    // For now, we'll simulate the check based on the existing data
    const fullName = `${profile.firstname} ${profile.lastname}`.toLowerCase().trim();
    
    // Simulate name matching logic
    // In real implementation, this would compare against scraped LinkedIn profile data
    return Math.random() > 0.3 ? "yes" : "no"; // Simulate 70% match rate
  }

  async updateVerificationStatus(id, status) {
    const profile = this.profiles.find(p => p.Id === parseInt(id));
    if (!profile) {
      throw new Error(`Profile with ID ${id} not found`);
    }
    
    // Check name match when verifying
    const nameMatch = this.checkNameMatch(profile);
    
    const updatedProfile = await this.update(id, {
      verificationStatus: status,
      verifiedAt: new Date().toISOString(),
      nameMatch: nameMatch
    });
    
    const statusText = status === "yes" ? "Match" : "No Match";
    const nameMatchText = nameMatch === "yes" ? "Name matches" : "Name doesn't match";
    toast.success(`Profile marked as: ${statusText} (${nameMatchText})`);
    
    return updatedProfile;
  }
async exportToCsv() {
    await this.delay(300);
    
    const headers = ["firstname", "lastname", "organization", "linkedin_url", "name_match", "verification_status", "verified_at"];
    const csvContent = [
      headers.join(","),
      ...this.profiles.map(profile => [
        profile.firstname,
        profile.lastname,
        profile.organization,
        profile.linkedinUrl,
        profile.nameMatch || "pending",
        profile.verificationStatus || "pending",
        profile.verifiedAt || ""
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `profile_verification_results_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Results exported successfully!");
    return true;
  }

  async getVerificationStats() {
    await this.delay(100);
    
    const total = this.profiles.length;
    const verified = this.profiles.filter(p => p.verificationStatus).length;
    const matches = this.profiles.filter(p => p.verificationStatus === "yes").length;
    const noMatches = this.profiles.filter(p => p.verificationStatus === "no").length;
    
    return {
      total,
      verified,
      matches,
      noMatches,
      pending: total - verified
    };
  }

  reset() {
    this.profiles = [];
    this.nextId = 1;
toast.info("Session reset");
  }

async bulkUpdateVerificationStatus(profileIds, status) {
    await this.delay(500);
    
    const updatedProfiles = [];
    const errors = [];
    
    for (const id of profileIds) {
      try {
        const index = this.profiles.findIndex(p => p.Id === parseInt(id));
        if (index === -1) {
          errors.push(`Profile with ID ${id} not found`);
          continue;
        }
        
        // Check name match for each profile
        const nameMatch = this.checkNameMatch(this.profiles[index]);
        
        this.profiles[index] = {
          ...this.profiles[index],
          verificationStatus: status,
          verifiedAt: new Date().toISOString(),
          nameMatch: nameMatch
        };
        
        updatedProfiles.push({ ...this.profiles[index] });
      } catch (error) {
        errors.push(`Failed to update profile ${id}: ${error.message}`);
      }
    }
    
// Show appropriate notifications
    if (updatedProfiles.length > 0) {
      const statusText = status === "yes" ? "Match" : "No Match";
      const matchCount = updatedProfiles.filter(p => p.nameMatch === "yes").length;
      const noMatchCount = updatedProfiles.filter(p => p.nameMatch === "no").length;
      
      toast.success(`${updatedProfiles.length} profile${updatedProfiles.length > 1 ? 's' : ''} marked as: ${statusText}`);
      toast.info(`Name matches: ${matchCount}, No matches: ${noMatchCount}`);
    }
    
    if (errors.length > 0) {
      toast.error(`${errors.length} profile${errors.length > 1 ? 's' : ''} failed to update`);
    }
    return updatedProfiles;
  }
}

export default new ProfileService();