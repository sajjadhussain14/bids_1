export const getAllOppotunitiesRecords = async (apiBackendURL, accessToken, tenantID) => {
    try {
        const url = `${apiBackendURL}opportunity/Opportunity/${tenantID}`;

        const response = await fetch(url, {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            redirect: 'follow',
        });

        if (!response.ok) {
            return {
                statusCode: "400",
                rfxData: [],
                error: response.statusText || 'Request failed for Rfxs',
            };
        }

        const result = await response.json();

        return {
            statusCode: 200,
            rfxData: result,
        };

    } catch (error) {
        return {
            statusCode: "400",
            rfxData: [],
            error: error.message || 'Request failed for Rfxs',
        };
    }
};


export const getOpportunityByID = async (apiBackendURL, accessToken, tenantID, id) => {
    try {
        const url = `${apiBackendURL}opportunity/Opportunity/${tenantID}/id/${id}`;

        const response = await fetch(url, {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            redirect: 'follow',
        });

        if (!response.ok) {
            return {
                statusCode: "400",
                opportunityData: [],
                error: response.statusText || 'Request failed for Rfxs',
            };
        }

        const result = await response.json();

        

        return {
            statusCode: 200,
            opportunityData: result,
        };

    } catch (error) {
        return {
            statusCode: "400",
            opportunityData: [],
            error: error.message || 'Request failed for Rfxs',
        };
    }
};
